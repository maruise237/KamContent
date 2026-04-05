import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, desc, and, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { profiles, publications, topics } from '@/lib/db/schema'
import { sendTelegramMessage, buildReminderMessage } from '@/lib/telegram/notify'
import { getISOWeekNumber } from '@/lib/utils'

/**
 * POST /api/telegram-notify
 * - Mode test : {"type":"test","chatId":"..."} — teste la connexion
 * - Mode cron (pas de body) : envoie des rappels aux utilisateurs inactifs depuis 48h
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))

    // Mode test depuis Settings
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

    // Récupération de tous les profils avec Telegram configuré
    const allProfiles = await db
      .select()
      .from(profiles)
      .where(and(
        // telegram_chat_id IS NOT NULL — on filtre après
      ))

    const activeProfiles = allProfiles.filter((p) => !!p.telegramChatId)

    let notified = 0
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    for (const profile of activeProfiles) {
      if (!profile.telegramChatId) continue

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

      await sendTelegramMessage(
        profile.telegramChatId,
        buildReminderMessage(profile.fullName ?? 'Créateur', nextTopic.title, daysSince)
      )
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
