'use client'

import { useState } from 'react'
import { Loader2, FileText, CheckSquare, Eye, Trash2, MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChannelBadge } from '@/components/shared/ChannelBadge'
import type { Topic, Script, ScriptPoint } from '@/lib/db/schema'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

/** Formate une Date en "YYYY-MM-DDTHH:MM" pour datetime-local */
function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface ContentSlotProps {
  topic: Topic
  script: Script | null
  isPastDay: boolean       // ce jour est dans le passé → lecture seule
  weekOffset: number       // 0=semaine courante, >0 futur, <0 passé
  todayDayIndex: number    // 0=Lun…6=Dim du jour actuel
  onGenerateScript: (topicId: string) => Promise<void>
  onMarkPublished: (topicId: string, publishedAt: Date, url?: string) => Promise<void>
  onDelete: (topicId: string) => void
  onMoveDay: (topicId: string, newDay: number) => void
  generatingScript: string | null
}

export function ContentSlot({
  topic,
  script,
  isPastDay,
  weekOffset,
  todayDayIndex,
  onGenerateScript,
  onMarkPublished,
  onDelete,
  onMoveDay,
  generatingScript,
}: ContentSlotProps) {
  const [showScript, setShowScript] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [publishTime, setPublishTime] = useState(() => toDatetimeLocal(new Date()))
  const [publishUrl, setPublishUrl] = useState('')
  const [publishing, setPublishing] = useState(false)
  const isGenerating = generatingScript === topic.id

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/topics?id=${topic.id}`, { method: 'DELETE' })
    onDelete(topic.id)
  }

  async function handleConfirmPublish() {
    setPublishing(true)
    await onMarkPublished(topic.id, new Date(publishTime), publishUrl || undefined)
    setPublishing(false)
    setShowPublish(false)
  }

  /** Un jour est disponible pour le déplacement ? */
  function isDayAvailable(dayIndex: number): boolean {
    if (weekOffset < 0) return false         // semaine passée : rien
    if (weekOffset > 0) return true          // semaine future : tout
    return dayIndex >= todayDayIndex         // semaine courante : aujourd'hui ou après
  }

  const canAct = !isPastDay && topic.status !== 'published'
  const isPublished = topic.status === 'published'

  return (
    <>
      <div className={`rounded-md border p-2 space-y-1.5 ${
        isPublished
          ? 'border-green-500/20 bg-green-500/5'
          : isPastDay
          ? 'border-border/40 bg-background/30'
          : 'border-border/60 bg-background/50'
      }`}>
        {/* Titre + actions rapides */}
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-medium leading-snug line-clamp-2 flex-1">{topic.title}</p>
          {!isPastDay && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-muted-foreground/30 hover:text-destructive transition-colors shrink-0 mt-0.5"
              title="Supprimer"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1 flex-wrap">
          <StatusBadge status={topic.status} />
          <ChannelBadge channel={topic.channel} />
        </div>

        {/* Déplacer vers un autre jour — seulement si pas publié et semaine non-passée */}
        {!isPublished && !isPastDay && topic.scheduledDay != null && (
          <div className="flex items-center gap-1">
            <MoveRight className="h-2.5 w-2.5 text-muted-foreground/50 shrink-0" />
            <Select
              value={String(topic.scheduledDay)}
              onValueChange={(v) => onMoveDay(topic.id, Number(v))}
            >
              <SelectTrigger className="h-5 text-[10px] border-none bg-transparent shadow-none px-1 w-auto gap-0.5 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_NAMES.map((name, i) => (
                  <SelectItem
                    key={i}
                    value={String(i)}
                    disabled={!isDayAvailable(i)}
                    className="text-xs"
                  >
                    {name}
                    {!isDayAvailable(i) && ' (passé)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-1 flex-wrap">
          {/* Voir / Générer script */}
          {script ? (
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
              onClick={() => setShowScript(true)}>
              <Eye className="h-3 w-3 mr-1" />Script
            </Button>
          ) : canAct ? (
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
              onClick={() => onGenerateScript(topic.id)} disabled={isGenerating}>
              {isGenerating
                ? <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                : <FileText className="h-3 w-3 mr-1" />}
              Script
            </Button>
          ) : null}

          {/* Marquer publié */}
          {canAct && (
            <Button size="sm" variant="ghost"
              className="h-6 px-2 text-xs text-green-500 hover:text-green-400"
              onClick={() => {
                setPublishTime(toDatetimeLocal(new Date()))
                setPublishUrl('')
                setShowPublish(true)
              }}>
              <CheckSquare className="h-3 w-3 mr-1" />
              Publié
            </Button>
          )}

          {/* Si publié mais script dispo, permettre de voir le script */}
          {isPublished && script && (
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
              onClick={() => setShowScript(true)}>
              <Eye className="h-3 w-3 mr-1" />Script
            </Button>
          )}
        </div>
      </div>

      {/* ─── Dialog : confirmer publication ─── */}
      <Dialog open={showPublish} onOpenChange={setShowPublish}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold leading-snug">
              Confirmer la publication
            </DialogTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{topic.title}</p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Date et heure de publication</Label>
              <Input
                type="datetime-local"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Modifie si tu as posté à une heure différente
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Lien vers la publication (optionnel)</Label>
              <Input
                type="url"
                placeholder="https://tiktok.com/@toi/video/..."
                value={publishUrl}
                onChange={(e) => setPublishUrl(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowPublish(false)}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleConfirmPublish} disabled={publishing}
              className="gap-2">
              {publishing && <Loader2 className="h-3 w-3 animate-spin" />}
              <CheckSquare className="h-3 w-3" />
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog : lire le script ─── */}
      <Dialog open={showScript} onOpenChange={setShowScript}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{topic.title}</DialogTitle>
          </DialogHeader>

          {script && (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Intro</p>
                <p className="leading-relaxed">{script.intro}</p>
              </div>

              {(script.points as unknown as ScriptPoint[]).map((point) => (
                <div key={point.order} className="rounded-lg border border-border bg-card/50 p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Point {point.order}
                  </p>
                  <p className="font-semibold mb-1">{point.title}</p>
                  <p className="text-muted-foreground leading-relaxed">{point.content}</p>
                </div>
              ))}

              <div className="rounded-lg border border-border bg-card/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Outro</p>
                <p className="leading-relaxed">{script.outro}</p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">CTA</p>
                <p className="leading-relaxed font-medium">{script.cta}</p>
              </div>

              {script.durationEstimate && (
                <p className="text-xs text-muted-foreground text-right">
                  Durée estimée : ~{Math.ceil(script.durationEstimate / 60)} min
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
