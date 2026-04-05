'use client'

import { ContentSlot } from './ContentSlot'
import type { Topic, Script } from '@/lib/db/schema'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

interface WeekCalendarProps {
  days: Date[]
  topics: Topic[]
  scripts: Record<string, Script>
  weekOffset: number
  onGenerateScript: (topicId: string) => Promise<void>
  onMarkPublished: (topicId: string, publishedAt: Date, url?: string) => Promise<void>
  onDelete: (topicId: string) => void
  onMoveDay: (topicId: string, newDay: number) => void
  generatingScript: string | null
}

export function WeekCalendar({
  days,
  topics,
  scripts,
  weekOffset,
  onGenerateScript,
  onMarkPublished,
  onDelete,
  onMoveDay,
  generatingScript,
}: WeekCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Index du jour actuel dans la semaine (0=Lun…6=Dim), -1 si hors semaine courante
  const todayDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dayDate = new Date(day)
        dayDate.setHours(0, 0, 0, 0)
        const isToday = dayDate.getTime() === today.getTime()
        // Un jour est "passé" si : semaine passée, OU semaine courante et index < aujourd'hui
        const isPastDay = weekOffset < 0 || (weekOffset === 0 && index < todayDayIndex)

        const dayTopics = topics.filter((t) => t.scheduledDay === index)

        return (
          <div
            key={day.toISOString()}
            className={`rounded-lg border p-2.5 min-h-[110px] ${
              isToday
                ? 'border-primary/50 bg-primary/5'
                : isPastDay
                ? 'border-border/40 bg-card/50 opacity-60'
                : 'border-border bg-card'
            }`}
          >
            {/* En-tête du jour */}
            <div className="flex items-center justify-between mb-2.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isToday ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {DAY_NAMES[index]}
              </span>
              <span className={`text-xs font-semibold ${
                isToday ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {day.getDate()}
              </span>
            </div>

            <div className="space-y-1.5">
              {dayTopics.map((topic) => (
                <ContentSlot
                  key={topic.id}
                  topic={topic}
                  script={scripts[topic.id] ?? null}
                  isPastDay={isPastDay}
                  weekOffset={weekOffset}
                  todayDayIndex={todayDayIndex}
                  onGenerateScript={onGenerateScript}
                  onMarkPublished={onMarkPublished}
                  onDelete={onDelete}
                  onMoveDay={onMoveDay}
                  generatingScript={generatingScript}
                />
              ))}
              {dayTopics.length === 0 && (
                <p className="text-[10px] text-muted-foreground/40 italic pt-1">Libre</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
