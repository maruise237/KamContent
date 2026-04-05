'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2, CheckCircle, XCircle, Send, Smartphone, Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type ConnectionStatus = 'connected' | 'disconnected' | 'pending'

function StatusDot({ status }: { status: ConnectionStatus }) {
  return (
    <span className={cn(
      'flex items-center gap-1.5 text-xs font-medium',
      status === 'connected' ? 'text-emerald-500' : 'text-muted-foreground/60'
    )}>
      <span className={cn(
        'h-1.5 w-1.5 rounded-full',
        status === 'connected' ? 'bg-emerald-500' : 'bg-muted-foreground/40'
      )} />
      {status === 'connected' ? 'Connecté' : 'Non connecté'}
    </span>
  )
}

export default function ChannelsPage() {
  const [tgStatus, setTgStatus] = useState<ConnectionStatus>('disconnected')
  const [tgChatId, setTgChatId] = useState('')
  const [tgSaving, setTgSaving] = useState(false)
  const [tgTesting, setTgTesting] = useState(false)
  const [tgResult, setTgResult] = useState<'success' | 'error' | null>(null)

  const [waStatus, setWaStatus] = useState<ConnectionStatus>('disconnected')
  const [waPhone, setWaPhone] = useState('')
  const [waSaving, setWaSaving] = useState(false)
  const [waRemoving, setWaRemoving] = useState(false)

  useEffect(() => {
    fetch('/api/channels').then((r) => r.json()).then(({ connections }) => {
      if (!connections) return
      for (const conn of connections) {
        if (conn.channel === 'telegram') {
          setTgStatus(conn.status)
          setTgChatId((conn.config as { chatId?: string }).chatId ?? '')
        }
        if (conn.channel === 'whatsapp') {
          setWaStatus(conn.status)
          setWaPhone((conn.config as { phoneNumber?: string }).phoneNumber ?? '')
        }
      }
    })
  }, [])

  // ── Telegram ────────────────────────────────────────────────────────────────

  async function saveTelegram() {
    if (!tgChatId.trim()) return
    setTgSaving(true)
    await fetch('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'telegram', status: 'connected', config: { chatId: tgChatId.trim() } }),
    })
    setTgSaving(false)
    setTgStatus('connected')
  }

  async function testTelegram() {
    if (!tgChatId.trim()) return
    setTgTesting(true)
    setTgResult(null)
    try {
      const res = await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: tgChatId, type: 'test' }),
      })
      setTgResult(res.ok ? 'success' : 'error')
    } catch {
      setTgResult('error')
    }
    setTgTesting(false)
  }

  async function disconnectTelegram() {
    await fetch('/api/channels', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'telegram' }),
    })
    setTgStatus('disconnected')
    setTgChatId('')
    setTgResult(null)
  }

  // ── WhatsApp (bot partagé — l'utilisateur donne son numéro) ─────────────────

  async function saveWhatsApp() {
    if (!waPhone.trim()) return
    setWaSaving(true)
    await fetch('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'whatsapp', status: 'connected', config: { phoneNumber: waPhone.trim() } }),
    })
    setWaSaving(false)
    setWaStatus('connected')
  }

  async function removeWhatsApp() {
    setWaRemoving(true)
    await fetch('/api/channels', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'whatsapp' }),
    })
    setWaRemoving(false)
    setWaStatus('disconnected')
    setWaPhone('')
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Canaux</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Reçois rappels et félicitations automatiques via le bot KamContent.
        </p>
      </div>

      {/* ── Telegram ── */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="border border-border/50 shadow-none">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                  <Send className="h-3.5 w-3.5 text-sky-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">Telegram</CardTitle>
                  <CardDescription className="text-xs">Bot partagé · un seul bot pour tous</CardDescription>
                </div>
              </div>
              <StatusDot status={tgStatus} />
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Envoie <code className="bg-muted px-1 py-0.5 rounded text-[11px]">/start</code> au bot, puis récupère ton Chat ID via{' '}
              <code className="bg-muted px-1 py-0.5 rounded text-[11px]">@userinfobot</code> sur Telegram.
            </p>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Chat ID</Label>
              <Input
                value={tgChatId}
                onChange={(e) => setTgChatId(e.target.value)}
                placeholder="123456789"
                disabled={tgStatus === 'connected'}
                className="h-8 text-sm"
              />
            </div>

            {tgResult === 'success' && (
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Message envoyé
              </p>
            )}
            {tgResult === 'error' && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <XCircle className="h-3 w-3" /> Chat ID incorrect
              </p>
            )}

            <div className="flex gap-2 pt-1">
              {tgStatus !== 'connected' ? (
                <Button size="sm" className="h-8 text-xs px-3" onClick={saveTelegram} disabled={tgSaving || !tgChatId.trim()}>
                  {tgSaving && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                  Connecter
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="h-8 text-xs px-3 text-destructive hover:text-destructive" onClick={disconnectTelegram}>
                  <Trash2 className="mr-1.5 h-3 w-3" />
                  Retirer
                </Button>
              )}
              <Button size="sm" variant="outline" className="h-8 text-xs px-3" onClick={testTelegram} disabled={tgTesting || !tgChatId.trim()}>
                {tgTesting ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Send className="mr-1.5 h-3 w-3" />}
                Tester
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── WhatsApp ── */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border border-border/50 shadow-none">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Smartphone className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
                  <CardDescription className="text-xs">Bot partagé · numéro global KamContent</CardDescription>
                </div>
              </div>
              <StatusDot status={waStatus} />
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le bot WhatsApp KamContent enverra les rappels à ce numéro.
              Format international requis (ex : <code className="bg-muted px-1 py-0.5 rounded text-[11px]">+33612345678</code>).
            </p>

            {waStatus === 'connected' ? (
              <div className="flex items-center gap-2 rounded-md bg-emerald-500/5 border border-emerald-500/15 px-3 py-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-xs text-emerald-600 font-mono">{waPhone}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Numéro WhatsApp</Label>
                <Input
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="+237612345678"
                  className="h-8 text-sm"
                />
              </div>
            )}

            <div className="flex gap-2 pt-1">
              {waStatus !== 'connected' ? (
                <Button size="sm" className="h-8 text-xs px-3" onClick={saveWhatsApp} disabled={waSaving || !waPhone.trim()}>
                  {waSaving && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                  Enregistrer
                </Button>
              ) : (
                <Button size="sm" variant="ghost" className="h-8 text-xs px-3 text-destructive hover:text-destructive" onClick={removeWhatsApp} disabled={waRemoving}>
                  {waRemoving ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Trash2 className="mr-1.5 h-3 w-3" />}
                  Retirer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
