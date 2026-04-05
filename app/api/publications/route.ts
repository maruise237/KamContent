import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { publications, topics } from '@/lib/db/schema'

/**
 * GET /api/publications?limit=20
 * Retourne les publications avec le titre du sujet associé
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 100)

    const rows = await db
      .select({
        id: publications.id,
        topicId: publications.topicId,
        topicTitle: topics.title,
        channel: publications.channel,
        publishedAt: publications.publishedAt,
        url: publications.url,
        notes: publications.notes,
      })
      .from(publications)
      .innerJoin(topics, eq(publications.topicId, topics.id))
      .where(eq(publications.userId, userId))
      .orderBy(desc(publications.publishedAt))
      .limit(limit)

    return NextResponse.json({ publications: rows })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
