'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2, Save, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const NICHES = ['automation', 'entrepreneuriat', 'tech', 'lifestyle', 'finance', 'education', 'marketing', 'autre']
const CHANNELS = ['tiktok', 'youtube', 'whatsapp', 'instagram', 'linkedin']
const CHANNEL_LABELS: Record<string, string> = {
  tiktok: 'TikTok',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}
const FREQUENCIES = [1, 3, 5, 7]

const settingsSchema = z.object({
  full_name: z.string().min(2, 'Prénom trop court'),
  niches: z.array(z.string()).min(1, 'Sélectionne au moins une niche'),
  channels: z.array(z.string()).min(1, 'Sélectionne au moins un canal'),
  languages: z.array(z.string()).min(1, 'Sélectionne au moins une langue'),
  target_frequency: z.number().min(1).max(7),
  telegram_chat_id: z.string().optional(),
})

type SettingsForm = z.infer<typeof settingsSchema>

function ToggleChip({
  value,
  selected,
  onToggle,
  label,
}: {
  value: string
  selected: boolean
  onToggle: (v: string) => void
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(value)}
      className={cn(
        'rounded-md border px-3 py-1.5 text-sm font-medium transition-all',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
      )}
    >
      {label ?? value}
    </button>
  )
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [telegramTesting, setTelegramTesting] = useState(false)
  const [telegramResult, setTelegramResult] = useState<'success' | 'error' | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      full_name: '',
      niches: [],
      channels: [],
      languages: [],
      target_frequency: 3,
      telegram_chat_id: '',
    },
  })

  const niches = watch('niches')
  const channels = watch('channels')
  const languages = watch('languages')

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        reset({
          full_name: profile.full_name ?? '',
          niches: profile.niches ?? [],
          channels: profile.channels ?? [],
          languages: profile.languages ?? [],
          target_frequency: profile.target_frequency ?? 3,
          telegram_chat_id: profile.telegram_chat_id ?? '',
        })
      }
    }
    loadProfile()
  }, [reset])

  function toggleArrayValue(field: 'niches' | 'channels' | 'languages', value: string) {
    const current = watch(field)
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setValue(field, updated, { shouldValidate: true })
  }

  async function onSubmit(data: SettingsForm) {
    setLoading(true)
    setSaved(false)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: data.full_name,
        niches: data.niches,
        channels: data.channels,
        languages: data.languages,
        target_frequency: data.target_frequency,
        telegram_chat_id: data.telegram_chat_id || null,
      })

    setLoading(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  async function testTelegram() {
    const chatId = watch('telegram_chat_id')
    if (!chatId) return

    setTelegramTesting(true)
    setTelegramResult(null)

    try {
      const res = await fetch('/api/telegram-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, type: 'test' }),
      })
      setTelegramResult(res.ok ? 'success' : 'error')
    } catch {
      setTelegramResult('error')
    } finally {
      setTelegramTesting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Configure ton profil et tes préférences de contenu</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profil */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>Tes informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Prénom / Nom</Label>
                <Input id="full_name" {...register('full_name')} placeholder="Jules" />
                {errors.full_name && (
                  <p className="text-sm text-destructive">{errors.full_name.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Niches */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle>Niches</CardTitle>
              <CardDescription>Tes domaines de création de contenu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((niche) => (
                  <ToggleChip
                    key={niche}
                    value={niche}
                    selected={niches.includes(niche)}
                    onToggle={(v) => toggleArrayValue('niches', v)}
                  />
                ))}
              </div>
              {errors.niches && (
                <p className="text-sm text-destructive mt-2">{errors.niches.message}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Canaux */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Canaux actifs</CardTitle>
              <CardDescription>Les plateformes sur lesquelles tu publies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((channel) => (
                  <ToggleChip
                    key={channel}
                    value={channel}
                    selected={channels.includes(channel)}
                    onToggle={(v) => toggleArrayValue('channels', v)}
                    label={CHANNEL_LABELS[channel]}
                  />
                ))}
              </div>
              {errors.channels && (
                <p className="text-sm text-destructive mt-2">{errors.channels.message}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Langues */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle>Langues</CardTitle>
              <CardDescription>Langues dans lesquelles tu crées du contenu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['fr', 'en'].map((lang) => (
                  <ToggleChip
                    key={lang}
                    value={lang}
                    selected={languages.includes(lang)}
                    onToggle={(v) => toggleArrayValue('languages', v)}
                    label={lang === 'fr' ? 'Français' : 'English'}
                  />
                ))}
              </div>
              {errors.languages && (
                <p className="text-sm text-destructive mt-2">{errors.languages.message}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Fréquence */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Fréquence cible</CardTitle>
              <CardDescription>Nombre de publications par semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="target_frequency"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((freq) => (
                        <SelectItem key={freq} value={String(freq)}>
                          {freq} publication{freq > 1 ? 's' : ''} / semaine
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Telegram */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle>Notifications Telegram</CardTitle>
              <CardDescription>
                Reçois des rappels et des félicitations sur Telegram.
                Utilise @userinfobot pour obtenir ton Chat ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram_chat_id">Chat ID Telegram</Label>
                <div className="flex gap-2">
                  <Input
                    id="telegram_chat_id"
                    {...register('telegram_chat_id')}
                    placeholder="123456789"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testTelegram}
                    disabled={telegramTesting || !watch('telegram_chat_id')}
                  >
                    {telegramTesting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="ml-2">Tester</span>
                  </Button>
                </div>
                {telegramResult === 'success' && (
                  <p className="text-sm text-green-500 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Message envoyé avec succès !
                  </p>
                )}
                {telegramResult === 'error' && (
                  <p className="text-sm text-destructive">Erreur : vérifie ton Chat ID</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</>
          ) : saved ? (
            <><CheckCircle className="mr-2 h-4 w-4" /> Enregistré !</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Enregistrer</>
          )}
        </Button>
      </form>
    </div>
  )
}
