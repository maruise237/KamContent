import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { topics } from '@/lib/db/schema'

const confirmSchema = z.object({
  selectedIds: z.array(z.string().uuid()).min(1).max(3),
  weekNumber: z.number().int().min(1).max(53),
  scheduledDays: z.array(z.number().min(0).max(6)),
})

/**
 * POST /api/topics/confirm
 * Opération atomique : déselectionne tous les topics de la semaine puis planifie
 * les topics sélectionnés avec leur jour attribué.
 * Remplace les deux PATCH séparés dans Brain pour éviter les race conditions.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await request.json()
    const { selectedIds, weekNumber, scheduledDays } = confirmSchema.parse(body)

    if (selectedIds.length !== scheduledDays.length) {
      return NextResponse.json({ error: 'selectedIds et scheduledDays doivent avoir la même longueur' }, { status: 400 })
    }

    // Transaction : les deux opérations échouent ensemble ou réussissent ensemble
    const result = await db.transaction(async (tx) => {
      // 1. Déselectionner tous les topics "idea" de cette semaine
      await tx
        .update(topics)
        .set({ selected: false, status: 'idea', scheduledDay: null })
        .where(
          and(
            eq(topics.userId, userId),
            eq(topics.weekNumber, weekNumber),
            eq(topics.status, 'idea')
          )
        )

      // 2. Planifier les topics sélectionnés (un par un pour assignerle bon jour)
      const updated = await Promise.all(
        selectedIds.map((id, i) =>
          tx
            .update(topics)
            .set({ selected: true, status: 'planned', weekNumber, scheduledDay: scheduledDays[i] })
            .where(and(eq(topics.id, id), eq(topics.userId, userId)))
            .returning()
        )
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
