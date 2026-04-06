import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { topics, scripts } from '@/lib/db/schema'
import { getAIModel } from '@/lib/ai/provider'
import { buildScriptPrompt } from '@/lib/claude/prompts'

const bodySchema = z.object({
  topicId: z.string().uuid(),
  instructions: z.string().optional(), // instructions de régénération
})

/**
 * POST /api/generate-script
 * Génère un script structuré + description + hashtags pour un sujet donné.
 * Passe `instructions` pour régénérer avec des consignes spécifiques.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { topicId, instructions } = bodySchema.parse(body)

    const [topic] = await db
      .select()
      .from(topics)
      .where(and(eq(topics.id, topicId), eq(topics.userId, userId)))
      .limit(1)

    if (!topic) {
      return NextResponse.json({ error: 'Sujet introuvable' }, { status: 404 })
    }

    const prompt = buildScriptPrompt(
      topic.title,
      topic.hook,
      topic.angle,
      topic.channel,
      topic.format,
      topic.language,
      instructions
    )

    const { text } = await generateText({
      model: getAIModel(),
      prompt,
      maxTokens: 2500,
    })

    let scriptData: {
      intro: string
      points: Array<{ order: number; title: string; content: string }>
      outro: string
      cta: string
      duration_estimate: number
      description?: string
      hashtags?: string[]
    }

    try {
      const jsonStart = text.indexOf('{')
      const jsonEnd = text.lastIndexOf('}') + 1
      scriptData = JSON.parse(text.slice(jsonStart, jsonEnd))
    } catch {
      throw new Error('Impossible de parser la réponse IA')
    }

    // Suppression du script existant
    await db.delete(scripts).where(eq(scripts.topicId, topicId))

    // Sauvegarde du nouveau script
    const [savedScript] = await db
      .insert(scripts)
      .values({
        topicId,
        userId,
        intro: scriptData.intro,
        points: scriptData.points,
        outro: scriptData.outro,
        cta: scriptData.cta,
        durationEstimate: scriptData.duration_estimate ?? null,
        description: scriptData.description ?? null,
        hashtags: scriptData.hashtags ?? [],
      })
      .returning()

    await db
      .update(topics)
      .set({ status: 'scripted' })
      .where(eq(topics.id, topicId))

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
