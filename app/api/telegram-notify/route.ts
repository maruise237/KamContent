import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { sendTelegramMessage, buildReminderMessage } from '@/lib/telegram/notify'
import { getISOWeekNumber } from '@/lib/utils'

/**
 * POST /api/telegram-notify
 * Cron job quotidien : envoie des rappels aux utilisateurs inactifs depuis 48h
 * Aussi utilisé pour tester la connexion Telegram depuis Settings
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

    // Mode cron : vérification de tous les utilisateurs actifs
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, telegram_chat_id')
      .not('telegram_chat_id', 'is', null)

    if (!profiles?.length) {
      return NextResponse.json({ message: 'Aucun utilisateur Telegram configuré' })
    }

    let notified = 0
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    for (const profile of profiles) {
      if (!profile.telegram_chat_id) continue

      // Dernière publication
      const { data: lastPub } = await supabase
        .from('publications')
        .select('published_at')
        .eq('user_id', profile.id)
        .order('published_at', { ascending: false })
        .limit(1)
        .single()

      const lastPubDate = lastPub ? new Date(lastPub.published_at) : null
      const shouldNotify = !lastPubDate || lastPubDate < twoDaysAgo

      if (!shouldNotify) continue

      // Prochain sujet planifié
      const weekNumber = getISOWeekNumber(new Date())
      const { data: nextTopic } = await supabase
        .from('topics')
        .select('title')
        .eq('user_id', profile.id)
        .eq('week_number', weekNumber)
        .in('status', ['planned', 'scripted'])
        .order('created_at')
        .limit(1)
        .single()

      if (!nextTopic) continue

      const daysSince = lastPubDate
        ? Math.floor((Date.now() - lastPubDate.getTime()) / 86400000)
        : 2

      const name = profile.full_name ?? 'Créateur'
      await sendTelegramMessage(
        profile.telegram_chat_id,
        buildReminderMessage(name, nextTopic.title, daysSince)
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
