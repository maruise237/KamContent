import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, and, inArray, gte, lte } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { getISOWeekNumber, toDateString, getWeekDays, getWeekNumberWithOffset } from '@/lib/utils'

/**
 * GET /api/topics
 *   ?week=current|<number>   filtre par numéro de semaine ISO
 *   ?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD  filtre par plage de dates
 *   ?status=planned,scripted,...
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const weekParam = searchParams.get('week')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const statusParam = searchParams.get('status')

    let rows

    if (dateFrom && dateTo) {
      // Filtre par plage de dates sur scheduledDate
      rows = await db
        .select()
        .from(topics)
        .where(
          and(
            eq(topics.userId, userId),
            gte(topics.scheduledDate, dateFrom),
            lte(topics.scheduledDate, dateTo)
          )
        )
        .orderBy(topics.scheduledDate)
    } else if (weekParam === 'current') {
      const weekNumber = getISOWeekNumber(new Date())
      rows = await db
        .select()
        .from(topics)
        .where(and(eq(topics.userId, userId), eq(topics.weekNumber, weekNumber)))
        .orderBy(topics.createdAt)
    } else if (weekParam && /^\d+$/.test(weekParam)) {
      rows = await db
        .select()
        .from(topics)
        .where(and(eq(topics.userId, userId), eq(topics.weekNumber, Number(weekParam))))
        .orderBy(topics.createdAt)
    } else {
      rows = await db
        .select()
        .from(topics)
        .where(eq(topics.userId, userId))
        .orderBy(topics.createdAt)
    }

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
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  scheduledDays: z.array(z.number().min(0).max(6)).optional(),
})

/** PATCH /api/topics — mise à jour en masse */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await request.json()
    const { ids, scheduledDays, ...updates } = patchSchema.parse(body)

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

/** DELETE /api/topics?id=uuid */
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
