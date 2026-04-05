'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WeekCalendar } from '@/components/planner/WeekCalendar'
import { getCurrentWeekDays, getISOWeekNumber } from '@/lib/utils'
import type { Topic, Script } from '@/lib/db/schema'

export default function PlannerPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<Topic[]>([])
  const [scripts, setScripts] = useState<Record<string, Script>>({})
  const [generatingScript, setGeneratingScript] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const weekDays = getCurrentWeekDays()
  const weekNumber = getISOWeekNumber(new Date())

  const loadData = useCallback(async () => {
    const res = await fetch('/api/topics?week=current&status=planned,scripted,published')
    const { topics: data } = await res.json()

    if (data?.length > 0) {
      setTopics(data)
      const ids = data.map((t: Topic) => t.id).join(',')
      const scriptsRes = await fetch(`/api/scripts?topicIds=${ids}`)
      const { scripts: scriptsData } = await scriptsRes.json()

      const map: Record<string, Script> = {}
      scriptsData?.forEach((s: Script) => { map[s.topicId] = s })
      setScripts(map)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function handleGenerateScript(topicId: string) {
    setGeneratingScript(topicId)
    setError(null)

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg ?? 'Erreur lors de la génération')
      }

      const { script } = await res.json()
      setScripts((prev) => ({ ...prev, [topicId]: script }))
      setTopics((prev) => prev.map((t) => t.id === topicId ? { ...t, status: 'scripted' } : t))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setGeneratingScript(null)
    }
  }

  async function handleMarkPublished(topicId: string) {
    const res = await fetch('/api/publish-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId }),
    })

    if (res.ok) {
      setTopics((prev) => prev.map((t) => t.id === topicId ? { ...t, status: 'published' } : t))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Planner</h1>
        <p className="text-muted-foreground mt-1">
          Semaine {weekNumber} · {weekDays[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — {weekDays[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {topics.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <WeekCalendar
            days={weekDays}
            topics={topics}
            scripts={scripts}
            onGenerateScript={handleGenerateScript}
            onMarkPublished={handleMarkPublished}
            generatingScript={generatingScript}
          />
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border h-64 gap-3">
          <Calendar className="h-10 w-10 text-muted-foreground/40" />
          <div className="text-center">
            <p className="font-medium">Aucun contenu planifié cette semaine</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Génère et sélectionne tes sujets dans le module Brain
            </p>
            <Button onClick={() => router.push('/dashboard/brain')}>Aller dans Brain</Button>
          </div>
        </div>
      )}
    </div>
  )
}
