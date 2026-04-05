'use client'

import { useState } from 'react'
import { Loader2, FileText, CheckSquare, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ChannelBadge } from '@/components/shared/ChannelBadge'
import type { Topic, Script, ScriptPoint } from '@/lib/db/schema'

interface ContentSlotProps {
  topic: Topic
  script: Script | null
  onGenerateScript: (topicId: string) => Promise<void>
  onMarkPublished: (topicId: string) => void
  onDelete: (topicId: string) => void
  generatingScript: string | null
}

export function ContentSlot({
  topic,
  script,
  onGenerateScript,
  onMarkPublished,
  onDelete,
  generatingScript,
}: ContentSlotProps) {
  const [showScript, setShowScript] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isGenerating = generatingScript === topic.id

  async function handleDelete() {
    setDeleting(true)
    await fetch(`/api/topics?id=${topic.id}`, { method: 'DELETE' })
    onDelete(topic.id)
  }

  return (
    <>
      <div className="rounded-md border border-border/60 bg-background/50 p-2.5 space-y-2">
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs font-medium leading-tight line-clamp-2 flex-1">{topic.title}</p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-muted-foreground/40 hover:text-destructive transition-colors shrink-0 mt-0.5"
            title="Supprimer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <StatusBadge status={topic.status} />
          <ChannelBadge channel={topic.channel} />
        </div>

        <div className="flex gap-1 flex-wrap">
          {script ? (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => setShowScript(true)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Script
            </Button>
          ) : topic.status !== 'published' ? (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => onGenerateScript(topic.id)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <FileText className="h-3 w-3 mr-1" />
              )}
              Script
            </Button>
          ) : null}

          {topic.status !== 'published' && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-green-500 hover:text-green-400"
              onClick={() => onMarkPublished(topic.id)}
            >
              <CheckSquare className="h-3 w-3 mr-1" />
              Publié
            </Button>
          )}
        </div>
      </div>

      {/* Modal script */}
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
