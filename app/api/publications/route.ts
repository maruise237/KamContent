import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, gte, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { publications } from '@/lib/db/schema'

/**
 * GET /api/publications?since=ISO_DATE
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const since = searchParams.get('since')

    const sinceDate = since
      ? new Date(since)
      : new Date(Date.now() - 56 * 24 * 60 * 60 * 1000) // 8 semaines par défaut

    const rows = await db
      .select()
      .from(publications)
      .where(
        eq(publications.userId, userId)
      )
      .orderBy(desc(publications.publishedAt))

    const filtered = rows.filter((p) => new Date(p.publishedAt) >= sinceDate)

    return NextResponse.json({ publications: filtered })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
