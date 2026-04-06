'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Brain, Calendar, BarChart3, ArrowRight, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChannelBadge } from '@/components/shared/ChannelBadge'
import type { Topic } from '@/lib/db/schema'

interface DashboardHomeProps {
  userName: string
  weeklyPublished: number
  weeklyTarget: number
  streak: number
  consistencyScore: number
  nextTopic: Topic | null
}

const SHORTCUTS = [
  { href: '/dashboard/brain', icon: Brain, label: 'Brain', description: 'Générer des sujets' },
  { href: '/dashboard/planner', icon: Calendar, label: 'Planner', description: 'Organiser la semaine' },
  { href: '/dashboard/tracker', icon: BarChart3, label: 'Tracker', description: 'Suivre la constance' },
]

export function DashboardHome({ userName, weeklyPublished, weeklyTarget, streak, consistencyScore, nextTopic }: DashboardHomeProps) {
  const weekProgress = Math.min(100, Math.round((weeklyPublished / Math.max(weeklyTarget, 1)) * 100))
  const hour = new Date().getHours()
  const greeting = hour < 1 ? 'Bonsoir' : hour < 6 ? 'Salut' : hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const timeEmoji = hour < 1 ? '🌙' : hour < 6 ? '⭐' : hour < 12 ? '☀️' : hour < 18 ? '🌤️' : '🌙'

  return (
    <div className="space-y-6">
      {/* Salutation */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">
          {greeting}, {userName} {timeEmoji}
        </h1>
        <p className="text-muted-foreground mt-1">
          Voici ton tableau de bord de création de contenu
        </p>
      </motion.div>

      {/* Stats semaine */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Contenus publiés */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cette semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display font-bold mb-2">
                {weeklyPublished}/{weeklyTarget}
              </div>
              <Progress value={weekProgress} className="h-1.5 mb-1" />
              <p className="text-xs text-muted-foreground">contenus publiés</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Flame className={`h-6 w-6 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                <span className="text-2xl font-display font-bold">{streak}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">semaine{streak !== 1 ? 's' : ''} consécutive{streak !== 1 ? 's' : ''}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score constance */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Constance mensuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display font-bold">{consistencyScore}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {consistencyScore >= 70 ? 'Excellent !' : consistencyScore >= 40 ? 'Continue !' : 'On y va !'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Prochain contenu */}
      {nextTopic && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Prochain contenu à créer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-semibold">{nextTopic.title}</p>
                  <p className="text-sm text-muted-foreground">{nextTopic.hook}</p>
                  <div className="flex gap-2">
                    <StatusBadge status={nextTopic.status} />
                    <ChannelBadge channel={nextTopic.channel} />
                  </div>
                </div>
                <Button size="sm" asChild>
                  <Link href="/dashboard/planner">
                    Voir <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Raccourcis */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-display text-lg font-semibold mb-3">Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SHORTCUTS.map((shortcut, index) => (
            <motion.div
              key={shortcut.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
            >
              <Link href={shortcut.href}>
                <Card className="cursor-pointer hover:border-primary/40 transition-colors group">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <shortcut.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{shortcut.label}</p>
                        <p className="text-xs text-muted-foreground">{shortcut.description}</p>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
