'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Check, Sparkles } from 'lucide-react'
import { GenerateButton } from '@/components/brain/GenerateButton'
import { TopicGrid } from '@/components/brain/TopicGrid'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getISOWeekNumber } from '@/lib/utils'
import type { Topic } from '@/lib/db/schema'

const MAX_SELECTION = 3

/** Retourne l'index du jour actuel (0=Lun … 6=Dim) */
function todayDayIndex(): number {
  const d = new Date().getDay() // 0=Dim, 1=Lun…
  return d === 0 ? 6 : d - 1
}

export default function BrainPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hints, setHints] = useState('')
  const [generating, setGenerating] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileReady, setProfileReady] = useState(true)

  useEffect(() => {
    async function loadExistingTopics() {
      const res = await fetch('/api/profile')
      const { profile } = await res.json()

      if (!profile?.niches?.length) {
        setProfileReady(false)
        return
      }

      const topicsRes = await fetch('/api/topics?week=current')
      const { topics: existing } = await topicsRes.json()

      if (existing?.length > 0) {
        setTopics(existing)
        setSelectedIds(existing.filter((t: Topic) => t.selected).map((t: Topic) => t.id))
      }
    }
    loadExistingTopics()
  }, [])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hints: hints.trim() || undefined }),
      })

      if (!res.ok) {
        const { error: msg } = await res.json()
        throw new Error(msg ?? 'Erreur lors de la génération')
      }

      const { topics: newTopics } = await res.json()
      setTopics(newTopics)
      setSelectedIds([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setGenerating(false)
    }
  }

  function handleToggle(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id)
      if (prev.length >= MAX_SELECTION) return prev
      return [...prev, id]
    })
  }

  async function handleConfirm() {
    if (selectedIds.length === 0) return
    setConfirming(true)

    try {
      const weekNumber = getISOWeekNumber(new Date())
      const allIds = topics.map((t) => t.id)
      const startDay = todayDayIndex()

      // Déselectionner tout
      await fetch('/api/topics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: allIds, selected: false, status: 'idea' }),
      })

      // Planifier les sélectionnés en les répartissant à partir d'aujourd'hui
      const scheduledDays = selectedIds.map((_, i) => (startDay + i) % 7)

      await fetch('/api/topics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          selected: true,
          status: 'planned',
          weekNumber,
          scheduledDays,
        }),
      })

      router.push('/dashboard/planner')
    } catch {
      setError('Erreur lors de la confirmation')
    } finally {
      setConfirming(false)
    }
  }

  if (!profileReady) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-yellow-500" />
        <div className="text-center">
          <h2 className="font-display text-xl font-semibold mb-2">Configure ton profil d'abord</h2>
          <p className="text-muted-foreground mb-4">
            Renseigne tes niches, canaux et langues pour générer des sujets pertinents.
          </p>
          <Button onClick={() => router.push('/dashboard/settings')}>
            Configurer mon profil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">Brain</h1>
        <p className="text-muted-foreground mt-1">
          Génère et sélectionne tes sujets de contenu pour la semaine
        </p>
      </div>

      {/* Zone d'idées — optionnelle */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Tes idées (optionnel)</p>
        </div>
        <Textarea
          placeholder="Ex : je veux parler de mes erreurs en tant que freelance, d'un outil IA que j'ai testé cette semaine, d'une astuce no-code…"
          className="resize-none text-sm min-h-[72px]"
          value={hints}
          onChange={(e) => setHints(e.target.value)}
          disabled={generating}
        />
        <p className="text-xs text-muted-foreground">L'IA utilisera tes idées comme point de départ</p>
      </div>

      {/* Bouton générer + compteur sélection */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <GenerateButton onClick={handleGenerate} loading={generating} />
        {topics.length > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{selectedIds.length}</span>/{MAX_SELECTION} sujets sélectionnés
          </p>
        )}
        {selectedIds.length > 0 && (
          <Button onClick={handleConfirm} disabled={confirming} className="gap-2 sm:ml-auto">
            <Check className="h-4 w-4" />
            Planifier ({selectedIds.length})
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {topics.length > 0 ? (
        <TopicGrid topics={topics} selectedIds={selectedIds} onToggle={handleToggle} maxSelection={MAX_SELECTION} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border h-52 gap-3">
          <div className="text-4xl">🧠</div>
          <div className="text-center">
            <p className="font-medium">Aucun sujet pour cette semaine</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ajoute tes idées ci-dessus puis clique sur &quot;Générer&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
