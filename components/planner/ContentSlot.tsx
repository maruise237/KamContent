'use client'

import { useState } from 'react'
import { Loader2, FileText, CheckSquare, Eye, Trash2, CalendarClock, Lock, SkipForward, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChannelBadge } from '@/components/shared/ChannelBadge'
import type { Topic, Script, ScriptPoint } from '@/lib/db/schema'

/** Formate une Date en "YYYY-MM-DDTHH:MM" pour datetime-local */
function toDatetimeLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

/** Retourne YYYY-MM-DD de la date actuelle */
function todayString(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

interface ContentSlotProps {
  topic: Topic
  script: Script | null
  dayStr: string           // YYYY-MM-DD du jour affiché
  todayStr: string         // YYYY-MM-DD d'aujourd'hui
  onGenerateScript: (topicId: string) => Promise<void>
  onMarkPublished: (topicId: string, publishedAt: Date, url?: string) => Promise<void>
  onDelete: (topicId: string) => void
  onMoveDate: (topicId: string, newDate: string) => Promise<void>
  generatingScript: string | null
}

export function ContentSlot({
  topic, script, dayStr, todayStr,
  onGenerateScript, onMarkPublished, onDelete, onMoveDate, generatingScript,
}: ContentSlotProps) {
  const [showScript, setShowScript]         = useState(false)
  const [showPublish, setShowPublish]       = useState(false)
  const [showReschedule, setShowReschedule] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting]             = useState(false)
  const [publishing, setPublishing]         = useState(false)
  const [moving, setMoving]                 = useState(false)
  const [slotError, setSlotError]           = useState<string | null>(null)
  const [publishTime, setPublishTime]       = useState(() => toDatetimeLocal(new Date()))
  const [publishUrl, setPublishUrl]         = useState('')
  const [newDate, setNewDate]               = useState(todayString)

  const isGenerating = generatingScript === topic.id
  const isPublished  = topic.status === 'published'
  // Un post est en retard si sa date programmée est passée ET qu'il n'est pas publié
  const isOverdue    = !isPublished && !!topic.scheduledDate && topic.scheduledDate < todayStr

  async function handleDelete() {
    setDeleting(true)
    setSlotError(null)
    try {
      const res = await fetch(`/api/topics?id=${topic.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Suppression échouée')
      toast.success('Sujet supprimé')
      onDelete(topic.id)
    } catch {
      setSlotError('Impossible de supprimer')
      setDeleting(false)
    }
    setShowDeleteConfirm(false)
  }

  async function handleConfirmPublish() {
    setPublishing(true)
    setSlotError(null)
    try {
      await onMarkPublished(topic.id, new Date(publishTime), publishUrl || undefined)
      toast.success('Contenu marqué comme publié')
      setShowPublish(false)
    } catch {
      setSlotError('Impossible de marquer comme publié')
    } finally {
      setPublishing(false)
    }
  }

  async function handleConfirmReschedule() {
    if (!newDate || newDate < todayString()) return
    setMoving(true)
    setSlotError(null)
    try {
      await onMoveDate(topic.id, newDate)
      toast.success('Reprogrammé')
      setShowReschedule(false)
    } catch {
      setSlotError('Impossible de reprogrammer')
    } finally {
      setMoving(false)
    }
  }

  /** Reporter à la semaine prochaine (lundi de S+1) */
  async function handlePostponeNextWeek() {
    const today = new Date()
    const dayOfWeek = today.getDay() || 7 // 1=Lun…7=Dim
    const daysUntilNextMonday = 8 - dayOfWeek
    const nextMonday = new Date(today)
    nextMonday.setDate(today.getDate() + daysUntilNextMonday)
    const p = (n: number) => String(n).padStart(2, '0')
    const nextMondayStr = `${nextMonday.getFullYear()}-${p(nextMonday.getMonth() + 1)}-${p(nextMonday.getDate())}`
    try {
      await onMoveDate(topic.id, nextMondayStr)
      toast.success('Reporté à la semaine prochaine')
    } catch {
      toast.error('Impossible de reporter')
    }
  }

  // ─── Carte publiée → verrouillée ────────────────────────────────────────────
  if (isPublished) {
    return (
      <>
        <div className="rounded-md border border-green-500/25 bg-green-500/5 p-2 space-y-1.5">
          <div className="flex items-start gap-1">
            <p className="text-xs font-medium leading-snug line-clamp-2 flex-1">{topic.title}</p>
            <Lock className="h-2.5 w-2.5 text-green-500/60 mt-0.5 shrink-0" />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <StatusBadge status={topic.status} />
            <ChannelBadge channel={topic.channel} />
          </div>
          {script && (
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => setShowScript(true)}>
              <Eye className="h-3 w-3 mr-1" />Script
            </Button>
          )}
        </div>

        {/* Script viewer */}
        <ScriptDialog open={showScript} onClose={() => setShowScript(false)} topic={topic} script={script} />
      </>
    )
  }

  // ─── Carte en retard → rouge ─────────────────────────────────────────────────
  // ─── Carte normale ─────────────────────────────────────────────────────────
  return (
    <>
      <div className={`rounded-md border p-2 space-y-1.5 ${
        isOverdue
          ? 'border-red-500/50 bg-red-500/5'
          : 'border-border/60 bg-background/50'
      }`}>
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            {isOverdue && (
              <span className="text-[9px] font-bold uppercase tracking-wide text-red-400 block mb-0.5">
                En retard
              </span>
            )}
            <p className="text-xs font-medium leading-snug line-clamp-2">{topic.title}</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="text-muted-foreground/30 hover:text-destructive transition-colors shrink-0 mt-0.5"
            title="Supprimer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <StatusBadge status={topic.status} />
          <ChannelBadge channel={topic.channel} />
        </div>

        {slotError && (
          <p className="text-[10px] text-destructive leading-tight">{slotError}</p>
        )}

        <div className="flex gap-1 flex-wrap">
          {/* Reporter S+1 (raccourci pour les retards) */}
          {isOverdue && (
            <Button size="sm" variant="ghost"
              className="h-6 px-2 text-xs text-orange-400 hover:text-orange-300"
              onClick={handlePostponeNextWeek}
            >
              <SkipForward className="h-3 w-3 mr-1" />S+1
            </Button>
          )}

          {/* Reprogrammer */}
          <Button
            size="sm" variant="ghost"
            className={`h-6 px-2 text-xs ${isOverdue ? 'text-red-400 hover:text-red-300' : 'text-muted-foreground'}`}
            onClick={() => { setNewDate(todayString()); setShowReschedule(true) }}
          >
            <CalendarClock className="h-3 w-3 mr-1" />
            {isOverdue ? 'Date' : 'Déplacer'}
          </Button>

          {/* Script */}
          {script ? (
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
              onClick={() => setShowScript(true)}>
              <Eye className="h-3 w-3 mr-1" />Script
            </Button>
          ) : (
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
              onClick={() => onGenerateScript(topic.id)} disabled={isGenerating}>
              {isGenerating
                ? <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                : <FileText className="h-3 w-3 mr-1" />}
              Script
            </Button>
          )}

          {/* Marquer publié — disponible même si en retard */}
          <Button size="sm" variant="ghost"
            className="h-6 px-2 text-xs text-green-500 hover:text-green-400"
            onClick={() => { setPublishTime(toDatetimeLocal(new Date())); setPublishUrl(''); setShowPublish(true) }}>
            <CheckSquare className="h-3 w-3 mr-1" />Publié
          </Button>
        </div>
      </div>

      {/* ── Dialog : reprogrammer ── */}
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Reprogrammer</DialogTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{topic.title}</p>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nouvelle date de publication</Label>
              <Input
                type="date"
                value={newDate}
                min={todayString()}
                onChange={(e) => setNewDate(e.target.value)}
                className="text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Tu peux choisir n'importe quelle date future — le contenu apparaîtra dans la semaine correspondante.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowReschedule(false)}>Annuler</Button>
            <Button size="sm" onClick={handleConfirmReschedule}
              disabled={moving || !newDate || newDate < todayString()}>
              {moving && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              <CalendarClock className="h-3 w-3 mr-1" />
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : confirmer publication ── */}
      <Dialog open={showPublish} onOpenChange={setShowPublish}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Confirmer la publication</DialogTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{topic.title}</p>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Date et heure</Label>
              <Input type="datetime-local" value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)} className="text-sm" />
              <p className="text-[11px] text-muted-foreground">Modifie si tu as posté à une autre heure</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lien vers la publication (optionnel)</Label>
              <Input type="url" placeholder="https://tiktok.com/@toi/video/..."
                value={publishUrl} onChange={(e) => setPublishUrl(e.target.value)} className="text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowPublish(false)}>Annuler</Button>
            <Button size="sm" onClick={handleConfirmPublish} disabled={publishing}>
              {publishing && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              <CheckSquare className="h-3 w-3 mr-1" />Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : confirmation suppression ── */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Supprimer ce sujet ?</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{topic.title}</p>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-1">Cette action est irréversible.</p>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : script ── */}
      <ScriptDialog open={showScript} onClose={() => setShowScript(false)} topic={topic} script={script} />
    </>
  )
}

function ScriptDialog({ open, onClose, topic, script }: {
  open: boolean; onClose: () => void; topic: Topic; script: Script | null
}) {
  const [copied, setCopied] = useState(false)

  function buildPlainText(): string {
    if (!script) return ''
    const points = (script.points as unknown as ScriptPoint[])
    return [
      `${topic.title}`,
      '',
      `INTRO\n${script.intro}`,
      '',
      ...points.map((p) => `POINT ${p.order} — ${p.title}\n${p.content}`),
      '',
      `OUTRO\n${script.outro}`,
      '',
      `CTA\n${script.cta}`,
    ].join('\n')
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildPlainText())
    setCopied(true)
    toast.success('Script copié')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <DialogTitle className="font-display">{topic.title}</DialogTitle>
            <Button size="sm" variant="outline" className="h-7 px-2 text-xs shrink-0" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? 'Copié' : 'Copier'}
            </Button>
          </div>
        </DialogHeader>
        {script && (
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-4">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Intro</p>
              <p className="leading-relaxed">{script.intro}</p>
            </div>
            {(script.points as unknown as ScriptPoint[]).map((point) => (
              <div key={point.order} className="rounded-lg border border-border bg-card/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Point {point.order}</p>
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
  )
}
