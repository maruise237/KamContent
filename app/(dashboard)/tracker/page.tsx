'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StreakBadge } from '@/components/tracker/StreakBadge'
import { ConsistencyChart } from '@/components/tracker/ConsistencyChart'
import { WeeklyProgress } from '@/components/tracker/WeeklyProgress'
import { ChannelBadge } from '@/components/shared/ChannelBadge'
import { createClient } from '@/lib/supabase/client'
import { getISOWeekNumber, calculateConsistencyScore } from '@/lib/utils'
import type { Publication } from '@/types/database'

interface WeekStats {
  week: string
  published: number
  target: number
}

export default function TrackerPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [weeklyData, setWeeklyData] = useState<WeekStats[]>([])
  const [thisWeekPublished, setThisWeekPublished] = useState(0)
  const [targetFrequency, setTargetFrequency] = useState(3)
  const [consistencyScore, setConsistencyScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('target_frequency')
        .eq('id', user.id)
        .single()

      const freq = profile?.target_frequency ?? 3
      setTargetFrequency(freq)

      // Publications des 8 dernières semaines
      const eightWeeksAgo = new Date()
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)

      const { data: pubs } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', user.id)
        .gte('published_at', eightWeeksAgo.toISOString())
        .order('published_at', { ascending: false })

      if (!pubs) { setLoading(false); return }

      setPublications(pubs as Publication[])

      // Calcul du streak et des stats par semaine
      const currentWeek = getISOWeekNumber(new Date())
      const pubsByWeek: Record<number, number> = {}

      pubs.forEach((pub) => {
        const week = getISOWeekNumber(new Date(pub.published_at))
        pubsByWeek[week] = (pubsByWeek[week] ?? 0) + 1
      })

      // Streak calculé en remontant depuis la semaine courante
      let currentStreak = 0
      let w = currentWeek
      for (let i = 0; i < 52; i++) {
        if ((pubsByWeek[w] ?? 0) >= 1) {
          currentStreak++
          w--
        } else {
          break
        }
      }
      setStreak(currentStreak)
      setBestStreak(Math.max(currentStreak, ...Object.values(pubsByWeek).map(() => 0)))

      // Stats semaine courante
      setThisWeekPublished(pubsByWeek[currentWeek] ?? 0)

      // Données pour le graphique (8 semaines)
      const chartData: WeekStats[] = []
      for (let i = 7; i >= 0; i--) {
        const weekNum = currentWeek - i
        chartData.push({
          week: `S${weekNum}`,
          published: pubsByWeek[weekNum] ?? 0,
          target: freq,
        })
      }
      setWeeklyData(chartData)

      // Score mensuel (4 dernières semaines)
      const last4Weeks = [currentWeek, currentWeek - 1, currentWeek - 2, currentWeek - 3]
      const monthlyPubs = last4Weeks.reduce((sum, w) => sum + (pubsByWeek[w] ?? 0), 0)
      const monthlyTarget = freq * 4
      setConsistencyScore(calculateConsistencyScore(monthlyPubs, monthlyTarget))

      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-sm">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Tracker</h1>
        <p className="text-muted-foreground mt-1">Suis ta constance et tes performances de publication</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak actuel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Streak actuel</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-4">
              <StreakBadge streak={streak} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Record */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Record personnel</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4 gap-1">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className="font-display text-4xl font-bold">{bestStreak}</span>
              <p className="text-xs text-muted-foreground">semaines</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score constance */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Score mensuel</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4 gap-1">
              <TrendingUp className={`h-8 w-8 ${consistencyScore >= 70 ? 'text-green-500' : 'text-primary'}`} />
              <span className="font-display text-4xl font-bold">{consistencyScore}%</span>
              <p className="text-xs text-muted-foreground">constance</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progression de la semaine */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle>Cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyProgress
              published={thisWeekPublished}
              target={targetFrequency}
              score={consistencyScore}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphique 8 semaines */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>8 dernières semaines</CardTitle>
            <CardDescription>Publications réelles vs objectif hebdomadaire</CardDescription>
          </CardHeader>
          <CardContent>
            <ConsistencyChart data={weeklyData} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Publications récentes */}
      {publications.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle>Publications récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {publications.slice(0, 10).map((pub) => (
                  <div
                    key={pub.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <ChannelBadge channel={pub.channel} />
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate max-w-[200px]"
                        >
                          {pub.url}
                        </a>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(pub.published_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
