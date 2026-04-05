'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const NICHES = ['automation', 'entrepreneuriat', 'tech', 'lifestyle', 'finance', 'education', 'marketing', 'autre']
const CHANNELS = ['tiktok', 'youtube', 'whatsapp', 'instagram', 'linkedin']
const CHANNEL_LABELS: Record<string, string> = {
  tiktok: 'TikTok', youtube: 'YouTube', whatsapp: 'WhatsApp', instagram: 'Instagram', linkedin: 'LinkedIn',
}
const FREQUENCIES = [1, 3, 5, 7]

const settingsSchema = z.object({
  fullName: z.string().min(2, 'Prénom trop court'),
  niches: z.array(z.string()).min(1, 'Sélectionne au moins une niche'),
  channels: z.array(z.string()).min(1, 'Sélectionne au moins un canal'),
  languages: z.array(z.string()).min(1, 'Sélectionne au moins une langue'),
  targetFrequency: z.number().min(1).max(7),
})

type SettingsForm = z.infer<typeof settingsSchema>

function ToggleChip({ value, selected, onToggle, label }: {
  value: string; selected: boolean; onToggle: (v: string) => void; label?: string
}) {
  return (
    <button type="button" onClick={() => onToggle(value)}
      className={cn(
        'rounded-md border px-3 py-1.5 text-sm font-medium transition-all',
        selected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
      )}
    >
      {label ?? value}
    </button>
  )
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { fullName: '', niches: [], channels: [], languages: [], targetFrequency: 3 },
  })

  const niches = watch('niches')
  const channels = watch('channels')
  const languages = watch('languages')

  useEffect(() => {
    fetch('/api/profile').then((r) => r.json()).then(({ profile }) => {
      if (profile) {
        reset({
          fullName: profile.fullName ?? '',
          niches: profile.niches ?? [],
          channels: profile.channels ?? [],
          languages: profile.languages ?? [],
          targetFrequency: profile.targetFrequency ?? 3,
        })
      }
    })
  }, [reset])

  function toggleArrayValue(field: 'niches' | 'channels' | 'languages', value: string) {
    const current = watch(field)
    setValue(field, current.includes(value) ? current.filter((v) => v !== value) : [...current, value], { shouldValidate: true })
  }

  async function onSubmit(data: SettingsForm) {
    setLoading(true)
    setSaved(false)

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.fullName,
        niches: data.niches,
        channels: data.channels,
        languages: data.languages,
        targetFrequency: data.targetFrequency,
      }),
    })

    setLoading(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Configure ton profil et tes préférences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Prénom / Nom</Label>
                <Input id="fullName" {...register('fullName')} placeholder="Jules" />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader><CardTitle>Niches</CardTitle><CardDescription>Tes domaines de création de contenu</CardDescription></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((niche) => (
                  <ToggleChip key={niche} value={niche} selected={niches.includes(niche)} onToggle={(v) => toggleArrayValue('niches', v)} />
                ))}
              </div>
              {errors.niches && <p className="text-sm text-destructive mt-2">{errors.niches.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle>Canaux actifs</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((channel) => (
                  <ToggleChip key={channel} value={channel} selected={channels.includes(channel)} onToggle={(v) => toggleArrayValue('channels', v)} label={CHANNEL_LABELS[channel]} />
                ))}
              </div>
              {errors.channels && <p className="text-sm text-destructive mt-2">{errors.channels.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader><CardTitle>Langues</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['fr', 'en'].map((lang) => (
                  <ToggleChip key={lang} value={lang} selected={languages.includes(lang)} onToggle={(v) => toggleArrayValue('languages', v)} label={lang === 'fr' ? 'Français' : 'English'} />
                ))}
              </div>
              {errors.languages && <p className="text-sm text-destructive mt-2">{errors.languages.message}</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle>Fréquence cible</CardTitle><CardDescription>Publications par semaine</CardDescription></CardHeader>
            <CardContent>
              <Controller name="targetFrequency" control={control} render={({ field }) => (
                <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v))}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq} value={String(freq)}>{freq} publication{freq > 1 ? 's' : ''} / semaine</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </CardContent>
          </Card>
        </motion.div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> :
            saved ? <><CheckCircle className="mr-2 h-4 w-4" />Enregistré !</> :
            <><Save className="mr-2 h-4 w-4" />Enregistrer</>}
        </Button>
      </form>
    </div>
  )
}
