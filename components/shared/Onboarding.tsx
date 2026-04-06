'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Calendar, BarChart3, Bell, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STEPS = [
  {
    icon: Brain,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'Brain — Génère tes sujets',
    desc: "L'IA analyse tes niches et canaux pour te proposer 15 idées chaque semaine. Sélectionnes-en jusqu'à 3 et planifie-les.",
  },
  {
    icon: Calendar,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    title: 'Planner — Organise ta semaine',
    desc: 'Tes sujets apparaissent ici avec leur date. Génère le script IA, déplace un sujet, marque comme publié.',
  },
  {
    icon: BarChart3,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    title: 'Tracker — Suis ta constance',
    desc: 'Visualise ton streak, ton score mensuel et tes publications. La régularité bat la perfection.',
  },
  {
    icon: Bell,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: 'Canaux — Rappels automatiques',
    desc: 'Connecte Telegram ou WhatsApp. Tu recevras un rappel si tu ne postes plus depuis 48h et un bilan chaque dimanche.',
  },
]

export function Onboarding() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('kc_onboarded')) {
      // Délai léger pour laisser le dashboard se charger
      const t = setTimeout(() => setOpen(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    localStorage.setItem('kc_onboarded', '1')
    setOpen(false)
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else dismiss()
  }

  if (!open) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
        onClick={dismiss}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 p-1 text-muted-foreground/40 hover:text-muted-foreground transition-colors rounded-md"
            aria-label="Ignorer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Indicateurs d'étapes */}
          <div className="flex justify-center gap-1.5 mb-7">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-primary' : i < step ? 'w-3 bg-primary/40' : 'w-3 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Icône */}
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${current.bg} mb-5`}>
            <current.icon className={`h-7 w-7 ${current.color}`} />
          </div>

          <h2 className="font-display text-xl font-bold mb-2">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-7">{current.desc}</p>

          <div className="flex items-center justify-between">
            <button onClick={dismiss} className="text-xs text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-2">
              Ignorer
            </button>
            <Button onClick={next} className="gap-1.5">
              {isLast ? 'Démarrer' : 'Suivant'}
              {!isLast && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
