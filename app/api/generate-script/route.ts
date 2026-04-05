import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { buildScriptPrompt } from '@/lib/claude/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const bodySchema = z.object({
  topicId: z.string().uuid(),
})

/**
 * POST /api/generate-script
 * Génère un script structuré pour un sujet donné
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topicId } = bodySchema.parse(body)

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

    // Génération via Claude
    const prompt = buildScriptPrompt(
      topic.title,
      topic.hook,
      topic.angle,
      topic.channel,
      topic.format,
      topic.language
    )

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Réponse Claude invalide')
    }

    // Parse du JSON
    let scriptData: {
      intro: string
      points: Array<{ order: number; title: string; content: string }>
      outro: string
      cta: string
      duration_estimate: number
    }

    try {
      const text = content.text.trim()
      const jsonStart = text.indexOf('{')
      const jsonEnd = text.lastIndexOf('}') + 1
      scriptData = JSON.parse(text.slice(jsonStart, jsonEnd))
    } catch {
      throw new Error('Impossible de parser la réponse Claude')
    }

    // Suppression d'un script existant
    await supabase.from('scripts').delete().eq('topic_id', topicId)

    // Sauvegarde du script
    const { data: savedScript, error: scriptError } = await supabase
      .from('scripts')
      .insert({
        topic_id: topicId,
        user_id: user.id,
        intro: scriptData.intro,
        points: scriptData.points,
        outro: scriptData.outro,
        cta: scriptData.cta,
        duration_estimate: scriptData.duration_estimate ?? null,
      })
      .select()
      .single()

    if (scriptError) {
      throw new Error(`Erreur sauvegarde : ${scriptError.message}`)
    }

    // Mise à jour du statut du sujet
    await supabase
      .from('topics')
      .update({ status: 'scripted' })
      .eq('id', topicId)

    return NextResponse.json({ script: savedScript })
  } catch (error) {
    console.error('[generate-script]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne' },
      { status: 500 }
    )
  }
}
