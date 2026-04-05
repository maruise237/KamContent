'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2, CheckCircle, XCircle, Send, QrCode, RefreshCw, Trash2, Plug,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ─── Types ────────────────────────────────────────────────────────────────────

type ConnectionStatus = 'connected' | 'disconnected' | 'pending'

interface TelegramState {
  status: ConnectionStatus
  chatId: string
  testing: boolean
  testResult: 'success' | 'error' | null
  saving: boolean
}

interface WhatsAppState {
  status: ConnectionStatus
  phoneNumber: string | null
  instanceName: string | null
  qrcode: string | null
  pairingCode: string | null
  loading: boolean
  disconnecting: boolean
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ConnectionStatus }) {
  if (status === 'connected') return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Connecté</Badge>
  if (status === 'pending') return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">En attente</Badge>
  return <Badge variant="secondary">Déconnecté</Badge>
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChannelsPage() {
  const [telegram, setTelegram] = useState<TelegramState>({
    status: 'disconnected',
    chatId: '',
    testing: false,
    testResult: null,
    saving: false,
  })

  const [whatsapp, setWhatsapp] = useState<WhatsAppState>({
    status: 'disconnected',
    phoneNumber: null,
    instanceName: null,
    qrcode: null,
    pairingCode: null,
    loading: false,
    disconnecting: false,
  })

  // ── Chargement initial des connexions ──────────────────────────────────────

  useEffect(() => {
    fetch('/api/channels')
      .then((r) => r.json())
      .then(({ connections }) => {
        if (!connections) return

        for (const conn of connections) {
          if (conn.channel === 'telegram') {
            setTelegram((prev) => ({
              ...prev,
              status: conn.status as ConnectionStatus,
              chatId: (conn.config as { chatId?: string }).chatId ?? '',
            }))
          }
          if (conn.channel === 'whatsapp') {
            setWhatsapp((prev) => ({
              ...prev,
              status: conn.status as ConnectionStatus,
              phoneNumber: (conn.config as { phoneNumber?: string }).phoneNumber ?? null,
              instanceName: (conn.config as { instanceName?: string }).instanceName ?? null,
            }))
          }
        }
      })
  }, [])

  // ── Polling WhatsApp quand en attente ──────────────────────────────────────

  const pollWhatsApp = useCallback(async () => {
    const res = await fetch('/api/channels/whatsapp')
    if (!res.ok) return
    const data = await res.json()
    setWhatsapp((prev) => ({
      ...prev,
      status: data.status as ConnectionStatus,
      phoneNumber: data.phoneNumber ?? prev.phoneNumber,
      instanceName: data.instanceName ?? prev.instanceName,
      // Effacer le QR code une fois connecté
      qrcode: data.status === 'connected' ? null : prev.qrcode,
    }))
  }, [])

  useEffect(() => {
    if (whatsapp.status !== 'pending') return
    const interval = setInterval(pollWhatsApp, 5000)
    return () => clearInterval(interval)
  }, [whatsapp.status, pollWhatsApp])

  // ─────────────────────────────────────────────────────────────────────────
  // TELEGRAM
  // ─────────────────────────────────────────────────────────────────────────

  async function saveTelegram() {
    if (!telegram.chatId.trim()) return
    setTelegram((prev) => ({ ...prev, saving: true }))

    await fetch('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: 'telegram',
        status: 'connected',
        config: { chatId: telegram.chatId.trim() },
      }),
    })

    setTelegram((prev) => ({ ...prev, saving: false, status: 'connected' }))
  }

  async function testTelegram() {
    if (!telegram.chatId.trim()) return
    setTelegram((prev) => ({ ...prev, testing: true, testResult: null }))

    try {
      const res = await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: telegram.chatId, type: 'test' }),
      })
      setTelegram((prev) => ({ ...prev, testResult: res.ok ? 'success' : 'error' }))
    } catch {
      setTelegram((prev) => ({ ...prev, testResult: 'error' }))
    } finally {
      setTelegram((prev) => ({ ...prev, testing: false }))
    }
  }

  async function disconnectTelegram() {
    await fetch('/api/channels', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'telegram' }),
    })
    setTelegram((prev) => ({ ...prev, status: 'disconnected', chatId: '', testResult: null }))
  }

  // ─────────────────────────────────────────────────────────────────────────
  // WHATSAPP
  // ─────────────────────────────────────────────────────────────────────────

  async function connectWhatsApp() {
    setWhatsapp((prev) => ({ ...prev, loading: true, qrcode: null }))

    const res = await fetch('/api/channels/whatsapp', { method: 'POST' })
    if (!res.ok) {
      setWhatsapp((prev) => ({ ...prev, loading: false }))
      return
    }

    const data = await res.json()
    setWhatsapp((prev) => ({
      ...prev,
      loading: false,
      status: 'pending',
      instanceName: data.instanceName,
      qrcode: data.qrcode,
      pairingCode: data.pairingCode,
    }))
  }

  async function refreshQRCode() {
    if (!whatsapp.instanceName) return
    setWhatsapp((prev) => ({ ...prev, loading: true }))

    const res = await fetch('/api/channels/whatsapp', { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setWhatsapp((prev) => ({
        ...prev,
        loading: false,
        qrcode: data.qrcode,
        pairingCode: data.pairingCode,
      }))
    } else {
      setWhatsapp((prev) => ({ ...prev, loading: false }))
    }
  }

  async function disconnectWhatsApp() {
    setWhatsapp((prev) => ({ ...prev, disconnecting: true }))
    await fetch('/api/channels/whatsapp', { method: 'DELETE' })
    setWhatsapp({
      status: 'disconnected',
      phoneNumber: null,
      instanceName: null,
      qrcode: null,
      pairingCode: null,
      loading: false,
      disconnecting: false,
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Canaux de notification</h1>
        <p className="text-muted-foreground mt-1">Connecte tes canaux pour recevoir des rappels et des félicitations automatiques</p>
      </div>

      {/* ── Telegram ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-blue-500" />
                Telegram
              </CardTitle>
              <CardDescription>
                Reçois des rappels via ton bot Telegram. Utilise{' '}
                <span className="font-mono text-xs bg-muted px-1 rounded">@userinfobot</span>{' '}
                pour obtenir ton Chat ID.
              </CardDescription>
            </div>
            <StatusBadge status={telegram.status} />
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatId">Chat ID Telegram</Label>
              <Input
                id="chatId"
                value={telegram.chatId}
                onChange={(e) => setTelegram((prev) => ({ ...prev, chatId: e.target.value }))}
                placeholder="123456789"
                disabled={telegram.status === 'connected'}
              />
            </div>

            {telegram.testResult === 'success' && (
              <p className="text-sm text-green-500 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Message envoyé !
              </p>
            )}
            {telegram.testResult === 'error' && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <XCircle className="h-4 w-4" /> Erreur : vérifie ton Chat ID
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {telegram.status !== 'connected' ? (
                <Button onClick={saveTelegram} disabled={telegram.saving || !telegram.chatId.trim()}>
                  {telegram.saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  Connecter
                </Button>
              ) : (
                <Button variant="destructive" size="sm" onClick={disconnectTelegram}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Déconnecter
                </Button>
              )}
              <Button
                variant="outline"
                onClick={testTelegram}
                disabled={telegram.testing || !telegram.chatId.trim()}
              >
                {telegram.testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Tester
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── WhatsApp ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-green-500" />
                WhatsApp
              </CardTitle>
              <CardDescription>
                Scanne le QR code avec WhatsApp pour connecter ton compte. La connexion est sécurisée via Evolution API auto-hébergé.
              </CardDescription>
            </div>
            <StatusBadge status={whatsapp.status} />
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Connecté */}
            {whatsapp.status === 'connected' && (
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 space-y-2">
                <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  WhatsApp connecté
                </p>
                {whatsapp.phoneNumber && (
                  <p className="text-sm text-muted-foreground">Numéro : {whatsapp.phoneNumber}</p>
                )}
              </div>
            )}

            {/* QR Code en attente */}
            {whatsapp.status === 'pending' && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ouvre WhatsApp → Appareils connectés → Connecter un appareil → Scanne le QR code
                </p>

                {whatsapp.qrcode ? (
                  <div className="flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={whatsapp.qrcode}
                      alt="QR Code WhatsApp"
                      className="h-48 w-48 rounded-lg border border-border"
                    />
                    {whatsapp.pairingCode && (
                      <p className="text-xs text-muted-foreground">
                        Code de couplage : <span className="font-mono font-bold">{whatsapp.pairingCode}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      En attente du scan…
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 rounded-lg border border-border bg-muted">
                    <QrCode className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            )}

            {/* Déconnecté */}
            {whatsapp.status === 'disconnected' && (
              <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border bg-muted/30">
                <p className="text-sm text-muted-foreground">Aucun compte WhatsApp connecté</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {whatsapp.status === 'disconnected' && (
                <Button onClick={connectWhatsApp} disabled={whatsapp.loading}>
                  {whatsapp.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <QrCode className="mr-2 h-4 w-4" />}
                  Générer le QR code
                </Button>
              )}

              {whatsapp.status === 'pending' && (
                <Button variant="outline" onClick={refreshQRCode} disabled={whatsapp.loading}>
                  {whatsapp.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Rafraîchir le QR
                </Button>
              )}

              {whatsapp.status !== 'disconnected' && (
                <Button variant="destructive" size="sm" onClick={disconnectWhatsApp} disabled={whatsapp.disconnecting}>
                  {whatsapp.disconnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Déconnecter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
