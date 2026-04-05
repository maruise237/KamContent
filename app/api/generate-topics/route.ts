import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { buildTopicsPrompt } from '@/lib/claude/prompts'
import { getISOWeekNumber } from '@/lib/utils'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * POST /api/generate-topics
 * Génère 15 sujets de contenu pour la semaine via Claude
 */
export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupération du profil utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('niches, channels, languages')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
    }

    if (!profile.niches?.length || !profile.channels?.length || !profile.languages?.length) {
      return NextResponse.json(
        { error: 'Complète ton profil (niches, canaux, langues) avant de générer des sujets' },
        { status: 400 }
      )
    }

    // Recherche de tendances via Tavily (optionnel)
    const trends: string[] = []
    if (process.env.TAVILY_API_KEY) {
      try {
        const tavilyRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: `tendances ${profile.niches.join(' ')} contenu créateurs 2025`,
            search_depth: 'basic',
            max_results: 5,
          }),
        })
        if (tavilyRes.ok) {
          const tavilyData = await tavilyRes.json()
          tavilyData.results?.forEach((r: { title: string }) => {
            if (r.title) trends.push(r.title)
          })
        }
      } catch {
        // On continue sans les tendances si Tavily échoue
      }
    }

    // Génération via Claude
    const prompt = buildTopicsPrompt(
      profile.niches,
      profile.channels,
      profile.languages,
      trends
    )

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Réponse Claude invalide')
    }

    // Parse du JSON
    let rawTopics: Array<{
      title: string
      hook: string
      angle: string
      niche: string
      channel: string
      language: string
      format: string
    }>

    try {
      const text = content.text.trim()
      const jsonStart = text.indexOf('[')
      const jsonEnd = text.lastIndexOf(']') + 1
      rawTopics = JSON.parse(text.slice(jsonStart, jsonEnd))
    } catch {
      throw new Error('Impossible de parser la réponse Claude')
    }

    // Suppression des anciens sujets non sélectionnés de la semaine
    const weekNumber = getISOWeekNumber(new Date())
    await supabase
      .from('topics')
      .delete()
      .eq('user_id', user.id)
      .eq('week_number', weekNumber)
      .eq('status', 'idea')

    // Sauvegarde en base
    const topicsToInsert = rawTopics.slice(0, 15).map((t) => ({
      user_id: user.id,
      title: t.title,
      hook: t.hook,
      angle: t.angle,
      niche: t.niche,
      channel: t.channel as 'tiktok' | 'youtube' | 'whatsapp',
      language: t.language as 'fr' | 'en',
      format: t.format as 'short' | 'long' | 'text',
      status: 'idea' as const,
      selected: false,
      week_number: weekNumber,
    }))

    const { data: savedTopics, error: insertError } = await supabase
      .from('topics')
      .insert(topicsToInsert)
      .select()

    if (insertError) {
      throw new Error(`Erreur sauvegarde : ${insertError.message}`)
    }

    return NextResponse.json({
      topics: savedTopics,
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[generate-topics]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne' },
      { status: 500 }
    )
  }
}
