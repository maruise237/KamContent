import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, and, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { getISOWeekNumber } from '@/lib/utils'

/**
 * GET /api/topics?week=current|all&status=planned,scripted
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const weekParam = searchParams.get('week')
    const statusParam = searchParams.get('status')

    let query = db.select().from(topics).where(eq(topics.userId, userId)).$dynamic()

    if (weekParam === 'current') {
      const weekNumber = getISOWeekNumber(new Date())
      query = db
        .select()
        .from(topics)
        .where(and(eq(topics.userId, userId), eq(topics.weekNumber, weekNumber)))
        .$dynamic()
    }

    const rows = await query.orderBy(topics.createdAt)

    const statusFilter = statusParam?.split(',').filter(Boolean)
    const filtered = statusFilter?.length
      ? rows.filter((t) => statusFilter.includes(t.status))
      : rows

    return NextResponse.json({ topics: filtered })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

const patchSchema = z.object({
  ids: z.array(z.string().uuid()),
  selected: z.boolean().optional(),
  status: z.enum(['idea', 'planned', 'scripted', 'published']).optional(),
  weekNumber: z.number().optional(),
  scheduledDay: z.number().min(0).max(6).optional(),
  scheduledDays: z.array(z.number().min(0).max(6)).optional(), // un jour par id dans le même ordre
})

/**
 * PATCH /api/topics — mise à jour en masse
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await request.json()
    const { ids, scheduledDays, ...updates } = patchSchema.parse(body)

    // Si on passe scheduledDays (tableau), on met à jour chaque topic individuellement
    if (scheduledDays && scheduledDays.length === ids.length) {
      const updated = await Promise.all(
        ids.map((id, i) =>
          db
            .update(topics)
            .set({ ...updates, scheduledDay: scheduledDays[i] })
            .where(and(eq(topics.userId, userId), eq(topics.id, id)))
            .returning()
        )
      )
      return NextResponse.json({ topics: updated.flat() })
    }

    const updated = await db
      .update(topics)
      .set(updates)
      .where(and(eq(topics.userId, userId), inArray(topics.id, ids)))
      .returning()

    return NextResponse.json({ topics: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/topics?id=uuid
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 })

    await db
      .delete(topics)
      .where(and(eq(topics.userId, userId), eq(topics.id, id)))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
