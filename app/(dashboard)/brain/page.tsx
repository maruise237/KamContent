'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, Check } from 'lucide-react'
import { GenerateButton } from '@/components/brain/GenerateButton'
import { TopicGrid } from '@/components/brain/TopicGrid'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { getISOWeekNumber } from '@/lib/utils'
import type { Topic } from '@/types/database'

const MAX_SELECTION = 3

export default function BrainPage() {
  const router = useRouter()
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileReady, setProfileReady] = useState(true)

  useEffect(() => {
    async function loadExistingTopics() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Vérification du profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('niches, channels, languages')
        .eq('id', user.id)
        .single()

      if (!profile || !profile.niches?.length) {
        setProfileReady(false)
        return
      }

      // Chargement des sujets de la semaine courante
      const weekNumber = getISOWeekNumber(new Date())
      const { data: existing } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_number', weekNumber)
        .order('created_at', { ascending: true })

      if (existing && existing.length > 0) {
        setTopics(existing as Topic[])
        setSelectedIds(existing.filter((t) => t.selected).map((t) => t.id))
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
      const supabase = createClient()
      const weekNumber = getISOWeekNumber(new Date())

      // Marque les sujets sélectionnés comme planned
      await supabase
        .from('topics')
        .update({ selected: false, status: 'idea' })
        .in('id', topics.map((t) => t.id))

      await supabase
        .from('topics')
        .update({ selected: true, status: 'planned', week_number: weekNumber })
        .in('id', selectedIds)

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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Brain</h1>
          <p className="text-muted-foreground mt-1">
            Génère et sélectionne tes sujets de contenu pour la semaine
          </p>
        </div>
        <GenerateButton onClick={handleGenerate} loading={generating} />
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Compteur de sélection */}
      {topics.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{selectedIds.length}</span>/{MAX_SELECTION} sujets sélectionnés
          </p>
          {selectedIds.length > 0 && (
            <Button
              onClick={handleConfirm}
              disabled={confirming}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Confirmer la sélection ({selectedIds.length})
            </Button>
          )}
        </motion.div>
      )}

      {/* Grille de sujets */}
      {topics.length > 0 ? (
        <TopicGrid
          topics={topics}
          selectedIds={selectedIds}
          onToggle={handleToggle}
          maxSelection={MAX_SELECTION}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border h-64 gap-3">
          <div className="text-4xl">🧠</div>
          <div className="text-center">
            <p className="font-medium">Aucun sujet pour cette semaine</p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique sur "Générer les sujets de la semaine" pour commencer
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
