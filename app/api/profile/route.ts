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
  notifWeeklyRecap: z.boolean().optional(),
  notifDailyReminder: z.boolean().optional(),
  reminderHour: z.number().min(0).max(23).optional(),
  bestStreak: z.number().min(0).optional(),
  timezone: z.string().min(1).optional(),
})

/**
 * PUT /api/profile — met à jour le profil
 * Seuls les champs présents dans le body sont mis à jour (pas d'écrasement avec undefined).
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const body = await request.json()
    const data = updateSchema.parse(body)

    // Construire l'objet de mise à jour uniquement avec les champs fournis
    const updateSet: Partial<{
      fullName: string | null
      niches: string[]
      channels: string[]
      languages: string[]
      targetFrequency: number
      telegramChatId: string | null
      notifWeeklyRecap: boolean
      notifDailyReminder: boolean
      reminderHour: number
      bestStreak: number
      timezone: string
    }> = {}
    if (data.fullName !== undefined) updateSet.fullName = data.fullName
    if (data.niches !== undefined) updateSet.niches = data.niches
    if (data.channels !== undefined) updateSet.channels = data.channels
    if (data.languages !== undefined) updateSet.languages = data.languages
    if (data.targetFrequency !== undefined) updateSet.targetFrequency = data.targetFrequency
    if (data.telegramChatId !== undefined) updateSet.telegramChatId = data.telegramChatId
    if (data.notifWeeklyRecap !== undefined) updateSet.notifWeeklyRecap = data.notifWeeklyRecap
    if (data.notifDailyReminder !== undefined) updateSet.notifDailyReminder = data.notifDailyReminder
    if (data.reminderHour !== undefined) updateSet.reminderHour = data.reminderHour
    if (data.bestStreak !== undefined) updateSet.bestStreak = data.bestStreak
    if (data.timezone !== undefined) updateSet.timezone = data.timezone

    const [updated] = await db
      .insert(profiles)
      .values({
        id: userId,
        fullName: data.fullName ?? null,
        niches: data.niches ?? [],
        channels: data.channels ?? [],
        languages: data.languages ?? [],
        targetFrequency: data.targetFrequency ?? 3,
        telegramChatId: data.telegramChatId ?? null,
      })
      .onConflictDoUpdate({
        target: profiles.id,
        set: updateSet,
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
