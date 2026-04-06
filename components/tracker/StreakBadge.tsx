'use client'

import { motion } from 'framer-motion'
import { Flame, Minus } from 'lucide-react'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-center justify-center gap-1"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: streak > 0 ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.6, repeat: streak > 0 ? Infinity : 0, repeatDelay: 3 }}
        >
          {streak === 0
            ? <Minus className="h-8 w-8 text-muted-foreground/40" />
            : <Flame className={`h-8 w-8 ${streak >= 6 ? 'text-red-500' : streak >= 3 ? 'text-orange-500' : 'text-amber-400'}`} />
          }
        </motion.div>
        <span className="font-display text-5xl font-bold text-foreground">
          {streak}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        semaine{streak !== 1 ? 's' : ''} consécutive{streak !== 1 ? 's' : ''}
      </p>
    </motion.div>
  )
}
