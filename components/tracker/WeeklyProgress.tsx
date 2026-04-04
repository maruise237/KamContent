'use client'

import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface WeeklyProgressProps {
  published: number
  target: number
  score: number
}

export function WeeklyProgress({ published, target, score }: WeeklyProgressProps) {
  const percentage = Math.min(100, Math.round((published / Math.max(target, 1)) * 100))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {published} / {target} cette semaine
        </p>
        <span className={`text-sm font-semibold ${
          percentage >= 100 ? 'text-green-500' : percentage >= 50 ? 'text-primary' : 'text-muted-foreground'
        }`}>
          {percentage}%
        </span>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        style={{ originX: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Progress value={percentage} className="h-2" />
      </motion.div>
      <p className="text-xs text-muted-foreground">
        Score mensuel de constance : <span className="font-semibold text-foreground">{score}%</span>
      </p>
    </div>
  )
}
