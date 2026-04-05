import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { sendTelegramMessage, buildCongratsMessage } from '@/lib/telegram/notify'
import { getISOWeekNumber, calculateConsistencyScore } from '@/lib/utils'

const bodySchema = z.object({
  topicId: z.string().uuid(),
  url: z.string().url().optional(),
  notes: z.string().optional(),
})

/**
 * POST /api/publish-content
 * Enregistre une publication et recalcule streak + score
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topicId, url, notes } = bodySchema.parse(body)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupération du sujet
    const { data: topic, error: topicError } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .eq('user_id', user.id)
      .single()

    if (topicError || !topic) {
      return NextResponse.json({ error: 'Sujet introuvable' }, { status: 404 })
    }

    // Création de la publication
    const { data: publication, error: pubError } = await supabase
      .from('publications')
      .insert({
        topic_id: topicId,
        user_id: user.id,
        channel: topic.channel,
        url: url ?? null,
        notes: notes ?? null,
      })
      .select()
      .single()

    if (pubError) {
      throw new Error(`Erreur création publication : ${pubError.message}`)
    }

    // Mise à jour du statut
    await supabase
      .from('topics')
      .update({ status: 'published' })
      .eq('id', topicId)

    // Calcul du streak
    const { data: allPubs } = await supabase
      .from('publications')
      .select('published_at')
      .eq('user_id', user.id)
      .order('published_at', { ascending: false })

    const pubsByWeek: Record<number, number> = {}
    allPubs?.forEach((p) => {
      const week = getISOWeekNumber(new Date(p.published_at))
      pubsByWeek[week] = (pubsByWeek[week] ?? 0) + 1
    })

    const currentWeek = getISOWeekNumber(new Date())
    let streak = 0
    let w = currentWeek
    for (let i = 0; i < 52; i++) {
      if ((pubsByWeek[w] ?? 0) >= 1) { streak++; w-- } else break
    }

    // Score de constance (4 dernières semaines)
    const { data: profile } = await supabase
      .from('profiles')
      .select('target_frequency, full_name, telegram_chat_id')
      .eq('id', user.id)
      .single()

    const targetFreq = profile?.target_frequency ?? 3
    const last4 = [currentWeek, currentWeek - 1, currentWeek - 2, currentWeek - 3]
    const monthlyPubs = last4.reduce((sum, wk) => sum + (pubsByWeek[wk] ?? 0), 0)
    const consistencyScore = calculateConsistencyScore(monthlyPubs, targetFreq * 4)

    // Notification Telegram
    if (profile?.telegram_chat_id) {
      const name = profile.full_name ?? 'Créateur'
      await sendTelegramMessage(
        profile.telegram_chat_id,
        buildCongratsMessage(name, streak, consistencyScore)
      )
    }

    return NextResponse.json({
      publication,
      streak,
      consistency_score: consistencyScore,
    })
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
