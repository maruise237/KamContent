import { NextRequest, NextResponse } from 'next/server'
import { eq, desc, and, inArray, gte } from 'drizzle-orm'
import { db } from '@/lib/db'
import { profiles, publications, topics, channelConnections } from '@/lib/db/schema'
import { sendTelegramMessage, buildReminderMessage } from '@/lib/telegram/notify'
import { sendWhatsAppNotification, buildWhatsAppReminderMessage } from '@/lib/whatsapp/notify'
import { toDateString } from '@/lib/utils'

/**
 * POST /api/telegram-notify
 * - Mode test : {"type":"test","chatId":"..."} — teste la connexion Telegram
 * - Mode cron : envoie des rappels aux utilisateurs inactifs depuis 48h
 *   Filtre par reminderHour pour respecter l'heure choisie par chaque utilisateur.
 *   Le cron doit tourner toutes les heures.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    // Mode test depuis la page Canaux
    if (body.type === 'test' && body.chatId) {
      const ok = await sendTelegramMessage(
        body.chatId,
        'KamContent est connecté. Tu recevras tes rappels ici.'
      )
      return NextResponse.json({ ok })
    }

    // Mode cron — on vérifie via le header secret
    const cronSecret = request.headers.get('x-cron-secret')
    const expectedSecret = process.env.CRON_SECRET

    if (!expectedSecret) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[telegram-notify] CRON_SECRET non configuré en production')
        return NextResponse.json({ error: 'Configuration serveur invalide' }, { status: 500 })
      }
      console.warn('[telegram-notify] CRON_SECRET non défini — requête cron non protégée')
    } else if (cronSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // On charge tous les profils avec rappels activés,
    // puis on filtre côté JS selon le fuseau horaire de chaque utilisateur
    const allProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.notifDailyReminder, true))

    let notified = 0
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    const todayStr = toDateString(new Date())

    for (const profile of allProfiles) {
      try {
        // Vérifier l'heure locale de l'utilisateur selon son fuseau
        const userTz = profile.timezone ?? 'UTC'
        const userHour = new Date().toLocaleString('en-US', { timeZone: userTz, hour: 'numeric', hour12: false })
        if (Number(userHour) !== profile.reminderHour) continue

        // Connexions actives
        const connections = await db
          .select()
          .from(channelConnections)
          .where(and(
            eq(channelConnections.userId, profile.id),
            inArray(channelConnections.channel, ['telegram', 'whatsapp'])
          ))

        const telegramConn = connections.find((c) => c.channel === 'telegram' && c.status === 'connected')
        const waConn = connections.find((c) => c.channel === 'whatsapp' && c.status === 'connected')

        // Compatibilité arrière : telegramChatId du profil
        const chatId = (telegramConn?.config as { chatId?: string } | undefined)?.chatId ?? profile.telegramChatId
        const hasChannel = !!chatId || !!waConn
        if (!hasChannel) continue

        // Dernière publication
        const [lastPub] = await db
          .select({ publishedAt: publications.publishedAt })
          .from(publications)
          .where(eq(publications.userId, profile.id))
          .orderBy(desc(publications.publishedAt))
          .limit(1)

        const lastPubDate = lastPub ? new Date(lastPub.publishedAt) : null
        if (lastPubDate && lastPubDate >= twoDaysAgo) continue // publié récemment

        // Prochain sujet planifié — utilise scheduledDate (source de vérité)
        const [nextTopic] = await db
          .select({ title: topics.title, scheduledDate: topics.scheduledDate })
          .from(topics)
          .where(
            and(
              eq(topics.userId, profile.id),
              inArray(topics.status, ['planned', 'scripted']),
              gte(topics.scheduledDate, todayStr)
            )
          )
          .orderBy(topics.scheduledDate)
          .limit(1)

        if (!nextTopic) continue

        const daysSince = lastPubDate
          ? Math.floor((Date.now() - lastPubDate.getTime()) / 86400000)
          : 2
        const name = profile.fullName ?? 'Créateur'
        const message = buildReminderMessage(name, nextTopic.title, daysSince)

        // Envoi Telegram
        if (chatId) await sendTelegramMessage(chatId, message)

        // Envoi WhatsApp
        if (waConn) {
          const phoneNumber = (waConn.config as { phoneNumber?: string }).phoneNumber
          if (phoneNumber) {
            await sendWhatsAppNotification(
              phoneNumber,
              buildWhatsAppReminderMessage(name, nextTopic.title, daysSince)
            )
          }
        }

        notified++
      } catch (err) {
        console.error(`[telegram-notify] Erreur profil ${profile.id}:`, err)
      }
    }

    return NextResponse.json({ notified, hour: currentHour })
  } catch (error) {
    console.error('[telegram-notify]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne' },
      { status: 500 }
    )
  }
}
