'use client'

import { ContentSlot } from './ContentSlot'
import { toDateString } from '@/lib/utils'
import type { Topic, Script } from '@/lib/db/schema'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

interface WeekCalendarProps {
  days: Date[]
  topics: Topic[]
  scripts: Record<string, Script>
  weekOffset: number
  onGenerateScript: (topicId: string, instructions?: string) => Promise<void>
  onMarkPublished: (topicId: string, publishedAt: Date, url?: string) => Promise<void>
  onDelete: (topicId: string) => void
  onMoveDate: (topicId: string, newDate: string) => Promise<void>
  generatingScript: string | null
}

export function WeekCalendar({
  days, topics, scripts, weekOffset,
  onGenerateScript, onMarkPublished, onDelete, onMoveDate, generatingScript,
}: WeekCalendarProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = toDateString(today)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
      {days.map((day, index) => {
        const dayStr = toDateString(day)
        const isToday = dayStr === todayStr
        const isPastDay = dayStr < todayStr

        // Groupe les topics dont la scheduledDate correspond exactement à ce jour
        const dayTopics = topics.filter((t) => t.scheduledDate === dayStr)

        return (
          <div
            key={dayStr}
            className={`rounded-lg border p-2.5 min-h-[110px] transition-colors ${
              isToday
                ? 'border-primary/50 bg-primary/5'
                : isPastDay
                ? 'border-border/30 bg-card/40'
                : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isToday ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {DAY_NAMES[index]}
              </span>
              <span className={`text-xs font-semibold ${
                isToday ? 'text-primary' : isPastDay ? 'text-muted-foreground/50' : 'text-muted-foreground'
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
                  dayStr={dayStr}
                  todayStr={todayStr}
                  onGenerateScript={onGenerateScript}
                  onMarkPublished={onMarkPublished}
                  onDelete={onDelete}
                  onMoveDate={onMoveDate}
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
