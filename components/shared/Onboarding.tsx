'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Calendar, BarChart3, ArrowRight, Sparkles,
  CheckCircle2, Loader2, User, Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

/* ─── Data ─────────────────────────────────────────────────────── */

const NICHES = [
  { value: 'entrepreneuriat', label: '💼 Entrepreneuriat' },
  { value: 'finance', label: '💰 Finance' },
  { value: 'tech', label: '💻 Tech' },
  { value: 'marketing', label: '📣 Marketing' },
  { value: 'education', label: '📚 Éducation' },
  { value: 'lifestyle', label: '✨ Lifestyle' },
  { value: 'automation', label: '🤖 Automatisation' },
  { value: 'autre', label: '🎯 Autre' },
]

const CHANNELS = [
  { value: 'tiktok', label: '🎵 TikTok' },
  { value: 'youtube', label: '▶️ YouTube' },
  { value: 'instagram', label: '📸 Instagram' },
  { value: 'linkedin', label: '💼 LinkedIn' },
  { value: 'whatsapp', label: '💬 WhatsApp' },
]

const FREQUENCIES = [
  { value: 1, label: '1×', sub: 'par semaine' },
  { value: 2, label: '2×', sub: 'par semaine' },
  { value: 3, label: '3×', sub: 'par semaine' },
  { value: 5, label: '5×', sub: 'par semaine' },
  { value: 7, label: '7×', sub: 'chaque jour' },
]

const TOUR_STEPS = [
  {
    icon: Brain,
    color: '#29AAE2',
    title: 'Brain — Idées & Scripts IA',
    desc: "L'IA génère 15 idées sur mesure chaque semaine. Sélectionnes-en 3, puis génère ton script à lire face caméra en un clic.",
  },
  {
    icon: Calendar,
    color: '#29AAE2',
    title: 'Planner — Ton calendrier',
    desc: 'Tes sujets sont planifiés automatiquement. Déplace, modifie, marque comme publié — tout en un seul endroit.',
  },
  {
    icon: BarChart3,
    color: '#29AAE2',
    title: 'Tracker — Ta constance',
    desc: 'Suis ton streak, ton score de régularité et ton historique. La constance bat la perfection.',
  },
]

/* ─── Sub-components ────────────────────────────────────────────── */

function Chip({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 cursor-pointer ${
        selected
          ? 'border-[#29AAE2] bg-[#29AAE2]/15 text-[#29AAE2]'
          : 'border-white/[0.1] bg-white/[0.04] text-white/60 hover:border-white/25 hover:text-white/80'
      }`}
    >
      {selected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
      {label}
    </button>
  )
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex justify-center gap-1.5 mb-7">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 bg-[#29AAE2]'
              : i < current
              ? 'w-3 bg-[#29AAE2]/40'
              : 'w-3 bg-white/10'
          }`}
        />
      ))}
    </div>
  )
}

/* ─── Main component ────────────────────────────────────────────── */

type Phase = 'setup' | 'tour' | 'done'

export function Onboarding() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('setup')
  const [setupStep, setSetupStep] = useState(0) // 0=name, 1=niches, 2=channels, 3=freq
  const [tourStep, setTourStep] = useState(0)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [niches, setNiches] = useState<string[]>([])
  const [channels, setChannels] = useState<string[]>([])
  const [frequency, setFrequency] = useState(3)

  useEffect(() => {
    // Ne montrer l'onboarding que si le profil n'est pas configuré
    async function check() {
      try {
        const res = await fetch('/api/profile')
        const { profile } = await res.json()
        if (!profile?.niches?.length) {
          // Nouveau user — préremplir le nom si dispo
          if (profile?.fullName) setName(profile.fullName)
          const t = setTimeout(() => setOpen(true), 600)
          return () => clearTimeout(t)
        }
        // Profil déjà configuré — vérifier si le tour a été vu
        if (!localStorage.getItem('kc_tour_done')) {
          setPhase('tour')
          const t = setTimeout(() => setOpen(true), 600)
          return () => clearTimeout(t)
        }
      } catch {
        // Silently ignore
      }
    }
    check()
  }, [])

  function toggleNiche(v: string) {
    setNiches((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v])
  }

  function toggleChannel(v: string) {
    setChannels((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v])
  }

  async function saveAndStartTour() {
    setSaving(true)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim() || undefined,
          niches,
          channels,
          targetFrequency: frequency,
        }),
      })
    } catch {
      // Continue even if save fails
    }
    setSaving(false)
    setPhase('tour')
    setTourStep(0)
  }

  function finishTour() {
    localStorage.setItem('kc_tour_done', '1')
    setOpen(false)
    router.push('/dashboard/brain')
    router.refresh()
  }

  function canAdvanceSetup() {
    if (setupStep === 0) return name.trim().length >= 2
    if (setupStep === 1) return niches.length >= 1
    if (setupStep === 2) return channels.length >= 1
    return true
  }

  async function nextSetup() {
    if (setupStep < 3) {
      setSetupStep(setupStep + 1)
    } else {
      await saveAndStartTour()
    }
  }

  function nextTour() {
    if (tourStep < TOUR_STEPS.length - 1) {
      setTourStep(tourStep + 1)
    } else {
      finishTour()
    }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      >
        <motion.div
          key={`${phase}-${setupStep}-${tourStep}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="bg-[#0C1018] border border-white/[0.08] rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/60 w-full sm:max-w-md relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#29AAE2] to-transparent opacity-60" />

          <div className="p-6">
            {/* ── SETUP PHASE ─────────────────────────────────────── */}
            {phase === 'setup' && (
              <>
                <StepDots total={4} current={setupStep} />

                {/* Step 0: Name */}
                {setupStep === 0 && (
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#29AAE2]/10 border border-[#29AAE2]/20 mb-5">
                      <User className="h-5 w-5 text-[#29AAE2]" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white mb-1 tracking-tight">
                      Bienvenue sur KamContent 👋
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">
                      Commence par te présenter — l&apos;IA personnalisera tes scripts avec ton prénom.
                    </p>
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/40 font-medium uppercase tracking-wider">Ton prénom</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex : Alex"
                        className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/25 focus:border-[#29AAE2] rounded-xl"
                        onKeyDown={(e) => e.key === 'Enter' && canAdvanceSetup() && nextSetup()}
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Step 1: Niches */}
                {setupStep === 1 && (
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#29AAE2]/10 border border-[#29AAE2]/20 mb-5">
                      <Brain className="h-5 w-5 text-[#29AAE2]" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white mb-1 tracking-tight">
                      Quelle est ta niche ?
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-5">
                      Sélectionne ton ou tes domaines de contenu. L&apos;IA s&apos;en servira pour générer des idées pertinentes.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {NICHES.map((n) => (
                        <Chip
                          key={n.value}
                          label={n.label}
                          selected={niches.includes(n.value)}
                          onClick={() => toggleNiche(n.value)}
                        />
                      ))}
                    </div>
                    {niches.length === 0 && (
                      <p className="text-white/30 text-xs mt-3">Sélectionne au moins une niche pour continuer.</p>
                    )}
                  </div>
                )}

                {/* Step 2: Channels */}
                {setupStep === 2 && (
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#29AAE2]/10 border border-[#29AAE2]/20 mb-5">
                      <Zap className="h-5 w-5 text-[#29AAE2]" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white mb-1 tracking-tight">
                      Sur quelles plateformes ?
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-5">
                      Les scripts et idées seront adaptés au format de tes plateformes.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CHANNELS.map((c) => (
                        <Chip
                          key={c.value}
                          label={c.label}
                          selected={channels.includes(c.value)}
                          onClick={() => toggleChannel(c.value)}
                        />
                      ))}
                    </div>
                    {channels.length === 0 && (
                      <p className="text-white/30 text-xs mt-3">Sélectionne au moins une plateforme.</p>
                    )}
                  </div>
                )}

                {/* Step 3: Frequency */}
                {setupStep === 3 && (
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#29AAE2]/10 border border-[#29AAE2]/20 mb-5">
                      <Calendar className="h-5 w-5 text-[#29AAE2]" />
                    </div>
                    <h2 className="font-display text-xl font-bold text-white mb-1 tracking-tight">
                      Tu veux publier combien de fois ?
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-5">
                      Le Tracker mesurera ta constance par rapport à cet objectif.
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {FREQUENCIES.map((f) => (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setFrequency(f.value)}
                          className={`flex flex-col items-center justify-center rounded-xl border py-3 transition-all duration-150 cursor-pointer ${
                            frequency === f.value
                              ? 'border-[#29AAE2] bg-[#29AAE2]/15 text-[#29AAE2]'
                              : 'border-white/[0.1] bg-white/[0.04] text-white/60 hover:border-white/20'
                          }`}
                        >
                          <span className="text-base font-bold">{f.label}</span>
                          <span className="text-[10px] mt-0.5 opacity-70">{f.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-7">
                  {setupStep > 0 ? (
                    <button
                      onClick={() => setSetupStep(setupStep - 1)}
                      className="text-xs text-white/35 hover:text-white/60 transition-colors"
                    >
                      ← Retour
                    </button>
                  ) : (
                    <div />
                  )}
                  <Button
                    onClick={nextSetup}
                    disabled={!canAdvanceSetup() || saving}
                    className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-xl px-5 gap-1.5 shadow-lg shadow-[#29AAE2]/20 transition-all duration-200"
                  >
                    {saving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement…</>
                    ) : setupStep === 3 ? (
                      <><Sparkles className="h-4 w-4" /> Lancer KamContent</>
                    ) : (
                      <>Suivant <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* ── TOUR PHASE ──────────────────────────────────────── */}
            {phase === 'tour' && (
              <>
                <StepDots total={TOUR_STEPS.length} current={tourStep} />

                {(() => {
                  const s = TOUR_STEPS[tourStep]
                  const Icon = s.icon
                  const isLast = tourStep === TOUR_STEPS.length - 1
                  return (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#29AAE2]/10 border border-[#29AAE2]/20 mb-5">
                        <Icon className="h-5 w-5 text-[#29AAE2]" />
                      </div>
                      <h2 className="font-display text-xl font-bold text-white mb-2 tracking-tight">
                        {s.title}
                      </h2>
                      <p className="text-white/55 text-sm leading-relaxed mb-7">
                        {s.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={finishTour}
                          className="text-xs text-white/30 hover:text-white/55 transition-colors underline underline-offset-2"
                        >
                          Passer
                        </button>
                        <Button
                          onClick={nextTour}
                          className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-xl px-5 gap-1.5 shadow-lg shadow-[#29AAE2]/20"
                        >
                          {isLast ? (
                            <><Sparkles className="h-4 w-4" /> C&apos;est parti !</>
                          ) : (
                            <>Suivant <ArrowRight className="h-4 w-4" /></>
                          )}
                        </Button>
                      </div>
                    </>
                  )
                })()}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
