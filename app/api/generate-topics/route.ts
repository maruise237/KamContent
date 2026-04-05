import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { auth } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { profiles, topics } from '@/lib/db/schema'
import { getAIModel } from '@/lib/ai/provider'
import { buildTopicsPrompt } from '@/lib/claude/prompts'
import { getISOWeekNumber } from '@/lib/utils'

/**
 * POST /api/generate-topics
 * Génère 15 sujets de contenu pour la semaine via l'IA configurée
 */
export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupération du profil
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)

    if (!profile) {
      // Création automatique du profil si inexistant
      await db.insert(profiles).values({ id: userId }).onConflictDoNothing()
      return NextResponse.json(
        { error: 'Complète ton profil (niches, canaux, langues) avant de générer des sujets' },
        { status: 400 }
      )
    }

    if (!profile.niches?.length || !profile.channels?.length || !profile.languages?.length) {
      return NextResponse.json(
        { error: 'Complète ton profil (niches, canaux, langues) avant de générer des sujets' },
        { status: 400 }
      )
    }

    // Recherche de tendances via SearXNG (optionnel)
    const trends: string[] = []
    const searxngUrl = process.env.SEARXNG_URL ?? 'http://searxng:8080'

    try {
      const query = encodeURIComponent(`tendances ${profile.niches.join(' ')} créateurs contenu 2025`)
      const res = await fetch(
        `${searxngUrl}/search?q=${query}&format=json&language=fr&time_range=week&categories=general`,
        {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(5000), // 5s max
        }
      )
      if (res.ok) {
        const data = await res.json()
        const results = data.results ?? []
        results.slice(0, 5).forEach((r: { title?: string }) => {
          if (r.title) trends.push(r.title)
        })
      }
    } catch {
      // SearXNG indisponible — on continue sans les tendances
    }

    // Génération via le fournisseur IA configuré
    const prompt = buildTopicsPrompt(profile.niches, profile.channels, profile.languages, trends)

    const { text } = await generateText({
      model: getAIModel(),
      prompt,
      maxTokens: 4096,
    })

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
      const jsonStart = text.indexOf('[')
      const jsonEnd = text.lastIndexOf(']') + 1
      rawTopics = JSON.parse(text.slice(jsonStart, jsonEnd))
    } catch {
      throw new Error('Impossible de parser la réponse IA')
    }

    const weekNumber = getISOWeekNumber(new Date())

    // Suppression des anciens sujets non planifiés de la semaine
    await db
      .delete(topics)
      .where(
        and(
          eq(topics.userId, userId),
          eq(topics.weekNumber, weekNumber),
          eq(topics.status, 'idea')
        )
      )

    // Insertion des nouveaux sujets
    const toInsert = rawTopics.slice(0, 15).map((t) => ({
      userId,
      title: t.title,
      hook: t.hook,
      angle: t.angle,
      niche: t.niche,
      channel: t.channel,
      language: t.language,
      format: t.format,
      status: 'idea' as const,
      selected: false,
      weekNumber,
    }))

    const saved = await db.insert(topics).values(toInsert).returning()

    return NextResponse.json({
      topics: saved,
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
