import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'

/**
 * GET /api/profile — récupère le profil de l'utilisateur connecté
 */
export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1)

    // Création automatique si inexistant
    if (!profile) {
      const [created] = await db
        .insert(profiles)
        .values({ id: userId })
        .returning()
      return NextResponse.json({ profile: created })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

const updateSchema = z.object({
  fullName: z.string().min(1).optional(),
  niches: z.array(z.string()).optional(),
  channels: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  targetFrequency: z.number().min(1).max(7).optional(),
  telegramChatId: z.string().nullable().optional(),
})

/**
 * PUT /api/profile — met à jour le profil
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await request.json()
    const data = updateSchema.parse(body)

    const [updated] = await db
      .insert(profiles)
      .values({
        id: userId,
        fullName: data.fullName,
        niches: data.niches ?? [],
        channels: data.channels ?? [],
        languages: data.languages ?? [],
        targetFrequency: data.targetFrequency ?? 3,
        telegramChatId: data.telegramChatId ?? null,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: {
          fullName: data.fullName,
          niches: data.niches,
          channels: data.channels,
          languages: data.languages,
          targetFrequency: data.targetFrequency,
          telegramChatId: data.telegramChatId,
        },
      })
      .returning()

    return NextResponse.json({ profile: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
