import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { eq, and, inArray, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { profiles, topics, publications, channelConnections } from '@/lib/db/schema'
import { sendTelegramMessage } from '@/lib/telegram/notify'
import { sendWhatsAppNotification } from '@/lib/whatsapp/notify'
import { getAIModel } from '@/lib/ai/provider'
import { buildWeeklyRecapPrompt } from '@/lib/claude/prompts'
import { getISOWeekNumber, toDateString, getWeekDays } from '@/lib/utils'

const DAY_NAMES_FR = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

/**
 * POST /api/weekly-recap
 * Cron hebdomadaire (ex: chaque dimanche à 19h00).
 * Génère un bilan personnalisé par IA et l'envoie via les canaux connectés.
 *
 * Protection : header x-cron-secret requis en production.
 */
export async function POST(request: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const cronSecret = request.headers.get('x-cron-secret')
    const expectedSecret = process.env.CRON_SECRET

    if (!expectedSecret) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'CRON_SECRET non configuré' }, { status: 500 })
      }
      console.warn('[weekly-recap] CRON_SECRET non défini — non protégé en dev')
    } else if (cronSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const currentWeek = getISOWeekNumber(new Date())
    const weekDays = getWeekDays(0)
    const dateFrom = toDateString(weekDays[0])
    const dateTo = toDateString(weekDays[6])

    // ── Récupérer tous les profils avec bilan hebdo activé ────────────────────
    const allProfiles = await db
      .select()
      .from(profiles)
      .where(eq(profiles.notifWeeklyRecap, true))

    let sent = 0

    for (const profile of allProfiles) {
      try {
        // Canaux connectés
        const connections = await db
          .select()
          .from(channelConnections)
          .where(
            and(
              eq(channelConnections.userId, profile.id),
              inArray(channelConnections.channel, ['telegram', 'whatsapp'])
            )
          )

        const tgConn = connections.find((c) => c.channel === 'telegram' && c.status === 'connected')
        const waConn = connections.find((c) => c.channel === 'whatsapp' && c.status === 'connected')

        const chatId = (tgConn?.config as { chatId?: string } | undefined)?.chatId ?? profile.telegramChatId
        const phoneNumber = (waConn?.config as { phoneNumber?: string } | undefined)?.phoneNumber

        // Si aucun canal connecté, on skip
        if (!chatId && !phoneNumber) continue

        // ── Publications de la semaine ───────────────────────────────────────
        const weekPubs = await db
          .select()
          .from(publications)
          .where(eq(publications.userId, profile.id))
          .orderBy(desc(publications.publishedAt))

        const thisWeekPubs = weekPubs.filter((p) => {
          const d = toDateString(new Date(p.publishedAt))
          return d >= dateFrom && d <= dateTo
        })

        // ── Sujets planifiés non publiés cette semaine ───────────────────────
        const weekTopics = await db
          .select()
          .from(topics)
          .where(
            and(
              eq(topics.userId, profile.id),
              eq(topics.weekNumber, currentWeek)
            )
          )

        const missed = weekTopics
          .filter((t) => ['planned', 'scripted'].includes(t.status))
          .map((t) => t.title)

        // ── Sujets planifiés semaine prochaine ───────────────────────────────
        const nextWeek = getISOWeekNumber(new Date(new Date().getTime() + 7 * 86400000))
        const nextTopics = await db
          .select()
          .from(topics)
          .where(
            and(
              eq(topics.userId, profile.id),
              eq(topics.weekNumber, nextWeek),
              inArray(topics.status, ['planned', 'scripted'])
            )
          )
          .limit(2)

        // ── Streak ──────────────────────────────────────────────────────────
        const allPubs = weekPubs
        const pubsByWeek: Record<number, number> = {}
        allPubs.forEach((p) => {
          const w = getISOWeekNumber(new Date(p.publishedAt))
          pubsByWeek[w] = (pubsByWeek[w] ?? 0) + 1
        })
        let streak = 0
        let w = currentWeek
        for (let i = 0; i < 52; i++) {
          if ((pubsByWeek[w] ?? 0) >= 1) { streak++; w-- } else break
        }

        // ── Meilleurs jours (basé sur l'historique récent) ───────────────────
        const dayCount: Record<number, number> = {}
        allPubs.slice(0, 30).forEach((p) => {
          const dow = new Date(p.publishedAt).getDay() // 0=Sun
          const idx = dow === 0 ? 6 : dow - 1 // 0=Mon…6=Sun
          dayCount[idx] = (dayCount[idx] ?? 0) + 1
        })
        const bestDays = Object.entries(dayCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([idx]) => DAY_NAMES_FR[Number(idx)])

        // ── Génération du message ─────────────────────────────────────────────
        const prompt = buildWeeklyRecapPrompt({
          name: profile.fullName ?? 'Créateur',
          weekNumber: currentWeek,
          published: thisWeekPubs.length,
          target: profile.targetFrequency,
          streak,
          missedTopics: missed.slice(0, 2),
          nextPlanned: nextTopics.map((t) => t.title),
          niches: profile.niches,
          mainChannel: profile.channels[0] ?? 'tiktok',
          bestDays,
        })

        const { text: message } = await generateText({
          model: getAIModel(),
          prompt,
          maxTokens: 300,
        })

        // ── Envoi ─────────────────────────────────────────────────────────────
        if (chatId) await sendTelegramMessage(chatId, message)
        if (phoneNumber) await sendWhatsAppNotification(phoneNumber, message)

        sent++
      } catch (err) {
        // On ne bloque pas les autres utilisateurs si l'un échoue
        console.error(`[weekly-recap] Erreur pour ${profile.id}:`, err)
      }
    }

    return NextResponse.json({ ok: true, sent })
  } catch (error) {
    console.error('[weekly-recap]', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
