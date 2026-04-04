'use client'

import { formatDateFr } from '@/lib/utils'
import { ContentSlot } from './ContentSlot'
import type { Topic, Script } from '@/types/database'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

interface WeekCalendarProps {
  days: Date[]
  topics: Topic[]
  scripts: Record<string, Script>
  onGenerateScript: (topicId: string) => Promise<void>
  onMarkPublished: (topicId: string) => void
  generatingScript: string | null
}

export function WeekCalendar({
  days,
  topics,
  scripts,
  onGenerateScript,
  onMarkPublished,
  generatingScript,
}: WeekCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
      {days.map((day, index) => {
        const dayDate = new Date(day)
        dayDate.setHours(0, 0, 0, 0)
        const isToday = dayDate.getTime() === today.getTime()
        const isPast = dayDate < today

        // Topics pour ce jour (répartition équitable)
        const dayTopics = topics.filter((_, i) => i % 7 === index)

        return (
          <div
            key={day.toISOString()}
            className={`rounded-lg border p-3 min-h-[120px] ${
              isToday ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'
            } ${isPast ? 'opacity-70' : ''}`}
          >
            {/* En-tête du jour */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wide ${
                isToday ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {DAY_NAMES[index]}
              </span>
              <span className={`text-xs font-medium ${
                isToday ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}>
                {day.getDate()}
              </span>
            </div>

            {/* Contenu du jour */}
            <div className="space-y-2">
              {dayTopics.map((topic) => (
                <ContentSlot
                  key={topic.id}
                  topic={topic}
                  script={scripts[topic.id] ?? null}
                  onGenerateScript={onGenerateScript}
                  onMarkPublished={onMarkPublished}
                  generatingScript={generatingScript}
                />
              ))}
              {dayTopics.length === 0 && (
                <p className="text-xs text-muted-foreground/50 italic">Libre</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
