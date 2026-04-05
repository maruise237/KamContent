import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, and, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import { scripts } from '@/lib/db/schema'

/**
 * GET /api/scripts?topicIds=id1,id2
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const topicIdsParam = searchParams.get('topicIds')

    if (!topicIdsParam) {
      return NextResponse.json({ scripts: [] })
    }

    const topicIds = topicIdsParam.split(',').filter(Boolean)

    const rows = await db
      .select()
      .from(scripts)
      .where(and(eq(scripts.userId, userId), inArray(scripts.topicId, topicIds)))

    return NextResponse.json({ scripts: rows })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
