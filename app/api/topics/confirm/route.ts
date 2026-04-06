import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { topics } from '@/lib/db/schema'
import { getISOWeekNumber, dayIndexFromDateString } from '@/lib/utils'

const confirmSchema = z.object({
  selectedIds: z.array(z.string().uuid()).min(1).max(3),
  scheduledDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)), // YYYY-MM-DD par topic
})

/**
 * POST /api/topics/confirm
 * Transaction atomique : remet tous les topics "idea" de la semaine à leur état
 * initial, puis planifie les sélectionnés avec une date concrète.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await request.json()
    const { selectedIds, scheduledDates } = confirmSchema.parse(body)

    if (selectedIds.length !== scheduledDates.length) {
      return NextResponse.json({ error: 'selectedIds et scheduledDates doivent avoir la même longueur' }, { status: 400 })
    }

    const result = await db.transaction(async (tx) => {
      // 1. Déselectionner tous les topics "idea" de la semaine courante
      const currentWeek = getISOWeekNumber(new Date())
      await tx
        .update(topics)
        .set({ selected: false, status: 'idea', scheduledDay: null, scheduledDate: null })
        .where(
          and(
            eq(topics.userId, userId),
            eq(topics.weekNumber, currentWeek),
            eq(topics.status, 'idea')
          )
        )

      // 2. Planifier chaque topic sélectionné avec sa date réelle
      const updated = await Promise.all(
        selectedIds.map((id, i) => {
          const dateStr = scheduledDates[i]
          const weekNumber = getISOWeekNumber(new Date(dateStr + 'T00:00:00'))
          const scheduledDay = dayIndexFromDateString(dateStr)

          return tx
            .update(topics)
            .set({
              selected: true,
              status: 'planned',
              weekNumber,
              scheduledDay,
              scheduledDate: dateStr,
            })
            .where(and(eq(topics.id, id), eq(topics.userId, userId)))
            .returning()
        })
      )

      return updated.flat()
    })

    return NextResponse.json({ topics: result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
