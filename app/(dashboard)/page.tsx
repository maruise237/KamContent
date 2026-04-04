import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardHome } from '@/components/shared/DashboardHome'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: topics },
    { data: publications },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('topics')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_number', getCurrentWeekNumber())
      .in('status', ['planned', 'scripted', 'published']),
    supabase
      .from('publications')
      .select('*')
      .eq('user_id', user.id)
      .gte('published_at', getMonthStart())
      .order('published_at', { ascending: false }),
  ])

  const weeklyPublished = publications?.filter((p) => {
    const pubWeek = getISOWeekNumber(new Date(p.published_at))
    return pubWeek === getCurrentWeekNumber()
  }).length ?? 0

  const targetFrequency = profile?.target_frequency ?? 3
  const publishedThisMonth = publications?.length ?? 0
  const monthlyTarget = targetFrequency * 4
  const consistencyScore = Math.min(100, Math.round((publishedThisMonth / Math.max(monthlyTarget, 1)) * 100))

  // Streak calculé simplement (publications par semaine)
  const pubsByWeek: Record<number, number> = {}
  publications?.forEach((pub) => {
    const week = getISOWeekNumber(new Date(pub.published_at))
    pubsByWeek[week] = (pubsByWeek[week] ?? 0) + 1
  })
  let streak = 0
  let w = getCurrentWeekNumber()
  for (let i = 0; i < 52; i++) {
    if ((pubsByWeek[w] ?? 0) >= 1) { streak++; w-- } else break
  }

  const nextTopic = topics?.find((t) => t.status === 'planned' || t.status === 'scripted')

  return (
    <DashboardHome
      userName={profile?.full_name ?? user.email?.split('@')[0] ?? 'Créateur'}
      weeklyPublished={weeklyPublished}
      weeklyTarget={targetFrequency}
      streak={streak}
      consistencyScore={consistencyScore}
      nextTopic={nextTopic ?? null}
      niches={profile?.niches ?? []}
    />
  )
}

function getCurrentWeekNumber(): number {
  return getISOWeekNumber(new Date())
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function getMonthStart(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}
