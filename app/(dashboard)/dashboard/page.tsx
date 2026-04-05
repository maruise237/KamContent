export const dynamic = 'force-dynamic'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { eq, desc, gte } from 'drizzle-orm'
import { db } from '@/lib/db'
import { profiles, topics, publications } from '@/lib/db/schema'
import { DashboardHome } from '@/components/shared/DashboardHome'
import { getISOWeekNumber, calculateConsistencyScore } from '@/lib/utils'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const clerkUser = await currentUser()

  // Upsert profil (création automatique à la première connexion)
  await db
    .insert(profiles)
    .values({
      id: userId,
      fullName: clerkUser?.fullName ?? clerkUser?.firstName ?? null,
    })
    .onConflictDoNothing()

  const currentWeek = getISOWeekNumber(new Date())
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [profile, weekTopics, monthPublications] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.id, userId)).limit(1).then((r) => r[0]),
    db
      .select()
      .from(topics)
      .where(eq(topics.userId, userId))
      .then((r) => r.filter((t) => t.weekNumber === currentWeek && ['planned', 'scripted', 'published'].includes(t.status))),
    db
      .select()
      .from(publications)
      .where(eq(publications.userId, userId))
      .orderBy(desc(publications.publishedAt)),
  ])

  const weeklyPublished = monthPublications.filter((p) => {
    return getISOWeekNumber(new Date(p.publishedAt)) === currentWeek
  }).length

  const targetFrequency = profile?.targetFrequency ?? 3

  // Streak
  const pubsByWeek: Record<number, number> = {}
  monthPublications.forEach((p) => {
    const week = getISOWeekNumber(new Date(p.publishedAt))
    pubsByWeek[week] = (pubsByWeek[week] ?? 0) + 1
  })
  let streak = 0
  let w = currentWeek
  for (let i = 0; i < 52; i++) {
    if ((pubsByWeek[w] ?? 0) >= 1) { streak++; w-- } else break
  }

  // Score mensuel
  const last4 = [currentWeek, currentWeek - 1, currentWeek - 2, currentWeek - 3]
  const monthlyPubs = last4.reduce((sum, wk) => sum + (pubsByWeek[wk] ?? 0), 0)
  const consistencyScore = calculateConsistencyScore(monthlyPubs, targetFrequency * 4)

  const nextTopic = weekTopics.find((t) => t.status === 'planned' || t.status === 'scripted') ?? null
  const userName = profile?.fullName ?? clerkUser?.firstName ?? 'Créateur'

  return (
    <DashboardHome
      userName={userName}
      weeklyPublished={weeklyPublished}
      weeklyTarget={targetFrequency}
      streak={streak}
      consistencyScore={consistencyScore}
      nextTopic={nextTopic}
    />
  )
}
