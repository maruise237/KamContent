import { NextRequest, NextResponse } from 'next/server'
import { eq, desc, and, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { profiles, publications, topics, channelConnections } from '@/lib/db/schema'
import { sendTelegramMessage, buildReminderMessage } from '@/lib/telegram/notify'
import { sendWhatsAppNotification, buildWhatsAppReminderMessage } from '@/lib/whatsapp/notify'
import { getISOWeekNumber } from '@/lib/utils'
import type { WhatsAppConfig } from '@/lib/db/schema'

/**
 * POST /api/telegram-notify
 * - Mode test : {"type":"test","chatId":"..."} — teste la connexion Telegram
 * - Mode cron (pas de body) : envoie des rappels aux utilisateurs inactifs depuis 48h
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    // Mode test depuis la page Canaux
    if (body.type === 'test' && body.chatId) {
      const ok = await sendTelegramMessage(
        body.chatId,
        '✅ KamContent est connecté ! Tu recevras tes rappels ici. 🎬'
      )
      return NextResponse.json({ ok })
    }

    // Mode cron — on vérifie via le header secret
    const cronSecret = request.headers.get('x-cron-secret')
    if (cronSecret !== process.env.CRON_SECRET && process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupération de tous les profils
    const allProfiles = await db.select().from(profiles)

    let notified = 0
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    for (const profile of allProfiles) {
      // Vérifier les connexions actives de ce profil
      const connections = await db
        .select()
        .from(channelConnections)
        .where(and(
          eq(channelConnections.userId, profile.id),
          inArray(channelConnections.channel, ['telegram', 'whatsapp'])
        ))

      const telegramConn = connections.find((c) => c.channel === 'telegram' && c.status === 'connected')
      const waConn = connections.find((c) => c.channel === 'whatsapp' && c.status === 'connected')

      // Compatibilité arrière : utiliser telegramChatId du profil si pas de connexion
      const hasTelegram = !!telegramConn || !!profile.telegramChatId
      const hasWhatsApp = !!waConn

      if (!hasTelegram && !hasWhatsApp) continue

      // Dernière publication
      const [lastPub] = await db
        .select({ publishedAt: publications.publishedAt })
        .from(publications)
        .where(eq(publications.userId, profile.id))
        .orderBy(desc(publications.publishedAt))
        .limit(1)

      const lastPubDate = lastPub ? new Date(lastPub.publishedAt) : null
      const shouldNotify = !lastPubDate || lastPubDate < twoDaysAgo
      if (!shouldNotify) continue

      // Prochain sujet planifié
      const weekNumber = getISOWeekNumber(new Date())
      const [nextTopic] = await db
        .select({ title: topics.title })
        .from(topics)
        .where(
          and(
            eq(topics.userId, profile.id),
            eq(topics.weekNumber, weekNumber),
            inArray(topics.status, ['planned', 'scripted'])
          )
        )
        .limit(1)

      if (!nextTopic) continue

      const daysSince = lastPubDate
        ? Math.floor((Date.now() - lastPubDate.getTime()) / 86400000)
        : 2
      const name = profile.fullName ?? 'Créateur'

      // Notification Telegram
      const chatId = (telegramConn?.config as { chatId?: string } | undefined)?.chatId ?? profile.telegramChatId
      if (chatId) {
        await sendTelegramMessage(chatId, buildReminderMessage(name, nextTopic.title, daysSince))
      }

      // Notification WhatsApp
      if (waConn) {
        const waConfig = waConn.config as WhatsAppConfig
        const phoneNumber = waConfig.phoneNumber
        if (phoneNumber) {
          await sendWhatsAppNotification(
            waConfig,
            phoneNumber,
            buildWhatsAppReminderMessage(name, nextTopic.title, daysSince)
          )
        }
      }

      notified++
    }

    return NextResponse.json({ notified })
  } catch (error) {
    console.error('[telegram-notify]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne' },
      { status: 500 }
    )
  }
}
