import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { profiles, topics, publications, channelConnections } from '@/lib/db/schema'
import { sendTelegramMessage, buildCongratsMessage } from '@/lib/telegram/notify'
import { sendWhatsAppNotification, buildWhatsAppCongratsMessage } from '@/lib/whatsapp/notify'
import { getISOWeekNumber, calculateConsistencyScore } from '@/lib/utils'

const bodySchema = z.object({
  topicId: z.string().uuid(),
  url: z.string().url().optional(),
  notes: z.string().optional(),
})

/**
 * POST /api/publish-content
 * Enregistre une publication, recalcule streak + score, envoie notifs Telegram + WhatsApp
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { topicId, url, notes } = bodySchema.parse(body)

    // Récupération du sujet
    const [topic] = await db
      .select()
      .from(topics)
      .where(and(eq(topics.id, topicId), eq(topics.userId, userId)))
      .limit(1)

    if (!topic) {
      return NextResponse.json({ error: 'Sujet introuvable' }, { status: 404 })
    }

    // Création de la publication
    const [publication] = await db
      .insert(publications)
      .values({
        topicId,
        userId,
        channel: topic.channel,
        url: url ?? null,
        notes: notes ?? null,
      })
      .returning()

    // Mise à jour du statut du sujet
    await db
      .update(topics)
      .set({ status: 'published' })
      .where(eq(topics.id, topicId))

    // Calcul du streak (publications par semaine ISO)
    const allPubs = await db
      .select({ publishedAt: publications.publishedAt })
      .from(publications)
      .where(eq(publications.userId, userId))

    const pubsByWeek: Record<number, number> = {}
    allPubs.forEach((p) => {
      const week = getISOWeekNumber(new Date(p.publishedAt))
      pubsByWeek[week] = (pubsByWeek[week] ?? 0) + 1
    })

    const currentWeek = getISOWeekNumber(new Date())
    let streak = 0
    let w = currentWeek
    for (let i = 0; i < 52; i++) {
      if ((pubsByWeek[w] ?? 0) >= 1) { streak++; w-- } else break
    }

    // Score mensuel (4 dernières semaines)
    const [profile] = await db
      .select({ targetFrequency: profiles.targetFrequency, fullName: profiles.fullName, telegramChatId: profiles.telegramChatId })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)

    const targetFreq = profile?.targetFrequency ?? 3
    const last4 = [currentWeek, currentWeek - 1, currentWeek - 2, currentWeek - 3]
    const monthlyPubs = last4.reduce((sum, wk) => sum + (pubsByWeek[wk] ?? 0), 0)
    const consistencyScore = calculateConsistencyScore(monthlyPubs, targetFreq * 4)
    const name = profile?.fullName ?? 'Créateur'

    // Notification Telegram
    if (profile?.telegramChatId) {
      await sendTelegramMessage(
        profile.telegramChatId,
        buildCongratsMessage(name, streak, consistencyScore)
      )
    }

    // Notification WhatsApp
    const [waConn] = await db
      .select()
      .from(channelConnections)
      .where(and(eq(channelConnections.userId, userId), eq(channelConnections.channel, 'whatsapp')))
      .limit(1)

    if (waConn && waConn.status === 'connected') {
      const phoneNumber = (waConn.config as { phoneNumber?: string }).phoneNumber
      if (phoneNumber) {
        await sendWhatsAppNotification(phoneNumber, buildWhatsAppCongratsMessage(name, streak, consistencyScore))
      }
    }

    return NextResponse.json({ publication, streak, consistency_score: consistencyScore })
  } catch (error) {
    console.error('[publish-content]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne' },
      { status: 500 }
    )
  }
}
