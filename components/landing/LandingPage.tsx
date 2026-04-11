'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain, Calendar, BarChart3, Zap, Target, TrendingUp,
  ChevronRight, Check, Sparkles, ArrowRight, Menu, X,
  Play, Star, Quote, FileText, Clock, RefreshCw, Flame,
  CheckCircle2, XCircle, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Animation helpers ──────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
})

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
})

/* ─── Animated Counter ───────────────────────────────────────────────── */
function Counter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let current = 0
          const step = end / (duration * 60)
          const timer = setInterval(() => {
            current += step
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, 1000 / 60)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Comment ça marche', href: '#how' },
    { label: 'Témoignages', href: '#testimonials' },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090F]/90 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="KamContent" className="h-8 w-8 rounded-xl" />
          <span className="font-display font-bold text-white text-[17px] tracking-tight">
            KamContent
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] text-white/50 hover:text-white/90 transition-colors duration-200 cursor-pointer"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/50 hover:text-white hover:bg-white/[0.06] text-[13px] h-8 cursor-pointer"
            >
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-full h-8 px-4 text-[13px] font-semibold shadow-lg shadow-[#29AAE2]/25 gap-1 cursor-pointer transition-all duration-200"
            >
              Commencer gratuitement
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/60 hover:text-white p-1.5 cursor-pointer"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#07090F]/95 backdrop-blur-xl border-b border-white/[0.06] px-5 pb-5">
          <nav className="flex flex-col gap-3 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/60 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full border-white/10 text-white/70 text-sm cursor-pointer">
                Se connecter
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-[#29AAE2] text-white text-sm cursor-pointer">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

/* ─── ATTENTION — Hero ───────────────────────────────────────────────── */
function Hero() {
  const platforms = ['TikTok', 'YouTube', 'Instagram', 'LinkedIn']
  const [platformIdx, setPlatformIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPlatformIdx((i) => (i + 1) % platforms.length), 2200)
    return () => clearInterval(t)
  }, [platforms.length])

  const avatars = [
    { init: 'AK', color: '#29AAE2' },
    { init: 'JT', color: '#8B5CF6' },
    { init: 'FD', color: '#10B981' },
    { init: 'MB', color: '#F59E0B' },
  ]

  const cardData = [
    { platform: 'TikTok', type: 'Court', color: '#29AAE2', title: "Comment j'ai doublé...", progress: 80 },
    { platform: 'YouTube', type: 'Long', color: '#EF4444', title: '5 erreurs qui tuent...', progress: 65 },
    { platform: 'LinkedIn', type: 'Texte', color: '#0077B5', title: 'Ma méthode pour...', progress: 90 },
    { platform: 'Instagram', type: 'Reel', color: '#E1306C', title: 'Le secret de la...', progress: 72 },
    { platform: 'TikTok', type: 'Court', color: '#29AAE2', title: '3 outils que tout...', progress: 85 },
    { platform: 'YouTube', type: 'Court', color: '#EF4444', title: 'Pourquoi tu stagnes...', progress: 55 },
  ]

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-[#29AAE2]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-5 w-full relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Social proof badge */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 bg-[#29AAE2]/[0.1] border border-[#29AAE2]/20 rounded-full px-4 py-1.5 mb-7"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-1.5">
              {avatars.map((a, i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-full border border-[#07090F] flex items-center justify-center text-[7px] font-bold"
                  style={{ backgroundColor: a.color + '55', color: a.color }}
                >
                  {a.init}
                </div>
              ))}
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/65 font-medium">500+ créateurs publient avec constance</span>
          </motion.div>

          {/* Headline — ATTENTION */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.8rem] sm:text-[3.6rem] md:text-[4.4rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Publie sur{' '}
            <span className="relative inline-block min-w-[7rem]">
              <motion.span
                key={platformIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-[#29AAE2] to-[#7DCFF5] bg-clip-text text-transparent"
              >
                {platforms[platformIdx]}
              </motion.span>
            </span>
            {' '}chaque semaine.{' '}
            <br className="hidden sm:block" />
            <span className="text-white/70">Sans jamais sécher d&apos;idées.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-[1.05rem] sm:text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            KamContent génère tes idées IA, planifie ta semaine et mesure ta constance —
            le tout en{' '}
            <strong className="text-white/80 font-semibold">moins de 10 minutes par semaine</strong>.
          </motion.p>

          {/* CTAs — ACTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-full px-8 h-12 text-[15px] font-semibold shadow-2xl shadow-[#29AAE2]/30 gap-2 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                Planifier ma première semaine
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how" className="cursor-pointer">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-full px-6 h-12 text-[15px] gap-2 cursor-pointer transition-all duration-200"
              >
                <Play className="h-4 w-4" />
                Voir comment ça marche
              </Button>
            </a>
          </motion.div>

          {/* Risk reversal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/35 mb-10"
          >
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-[#29AAE2]" /> Aucune carte de crédit
            </span>
            <span className="hidden sm:block w-px h-3.5 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-[#29AAE2]" /> Gratuit pour toujours
            </span>
            <span className="hidden sm:block w-px h-3.5 bg-white/10" />
            <span className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-[#29AAE2]" /> 30 idées bonus la 1ère semaine
            </span>
          </motion.div>

          {/* FOMO signal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center justify-center gap-1.5 text-[11px] text-orange-400/80 bg-orange-500/[0.08] border border-orange-500/[0.15] rounded-full px-3 py-1 mx-auto w-fit mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            4 nouveaux créateurs inscrits cette semaine
          </motion.div>

          {/* App mockup */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-3xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0C1018] shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#141824] border-b border-white/[0.06]">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <div className="ml-3 flex-1 bg-[#0C1018] rounded h-5 flex items-center px-3 max-w-[240px]">
                <span className="text-[10px] text-white/20">app.kamcontent.com/dashboard</span>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-white/25">En direct</span>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/30 mb-0.5">Semaine du 7 Avril</p>
                  <p className="text-sm font-semibold text-white">Brain IA — 15 idées générées</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-medium">Score: 85%</span>
                  </div>
                  <div className="h-8 w-24 bg-[#29AAE2]/20 border border-[#29AAE2]/20 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-[#29AAE2] font-medium">+ Générer</span>
                  </div>
                </div>
              </div>

              {/* Content cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cardData.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.07 }}
                    className="rounded-xl bg-[#141824] border border-white/[0.06] p-3 space-y-2 cursor-pointer hover:border-white/[0.12] transition-colors"
                  >
                    <p className="text-[10px] text-white/70 leading-tight font-medium">{card.title}</p>
                    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${card.progress}%`, backgroundColor: card.color + '80' }}
                      />
                    </div>
                    <div className="flex gap-1.5 items-center">
                      <span
                        className="h-4 px-1.5 rounded-full text-[9px] flex items-center font-medium"
                        style={{ backgroundColor: card.color + '20', color: card.color }}
                      >
                        {card.platform}
                      </span>
                      <span className="h-4 px-1.5 bg-white/[0.04] text-white/30 rounded-full text-[9px] flex items-center">
                        {card.type}
                      </span>
                      <Check className="h-3 w-3 text-emerald-400 ml-auto" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#07090F] to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Trust bar ──────────────────────────────────────────────────────── */
function TrustBar() {
  const items = [
    { icon: Users, value: '500+', sub: 'créateurs actifs' },
    { icon: Zap, value: '15 idées', sub: 'générées en 30 secondes' },
    { icon: Calendar, value: '1 clic', sub: 'pour planifier la semaine' },
    { icon: Flame, value: '92%', sub: 'taux de constance moyen' },
  ]

  return (
    <section className="border-y border-white/[0.06] bg-[#0C1018]">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29AAE2]/[0.1] border border-[#29AAE2]/10 shrink-0">
                <item.icon className="h-[18px] w-[18px] text-[#29AAE2]" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-base leading-tight">{item.value}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── INTEREST — Problem ─────────────────────────────────────────────── */
function ProblemSection() {
  const pains = [
    {
      icon: Clock,
      title: "L'angoisse de la page blanche",
      body: "Tu passes 2-3h à chercher quoi publier... et finalement tu ne postes rien. Le temps s'écoule, l'audience grandit ailleurs.",
      stat: '72% des créateurs abandonnent en moins de 90 jours',
    },
    {
      icon: RefreshCw,
      title: 'La constance tue ta croissance',
      body: "Tu publies 5 fois une semaine, puis tu disparais 3 semaines. L'algorithme voit ça : créateur inactif. Fini la visibilité.",
      stat: 'La constance = 10x plus important que la qualité',
    },
    {
      icon: BarChart3,
      title: 'Tu ne sais pas ce qui marche',
      body: "Sans données claires, tu devines. Hashtags? Timing? Format? Tu tournes en rond depuis 6 mois sans avancer.",
      stat: 'Les créateurs mesurés croissent 5x plus vite',
    },
  ]

  return (
    <section className="py-24 bg-[#07090F]">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-red-500/[0.08] border border-red-500/15 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs text-red-400/70 font-medium tracking-wide">Le problème</span>
          </div>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-white mb-4 tracking-tight">
            Tu te reconnais là-dedans ?
          </h2>
          <p className="text-white/45 max-w-xl mx-auto text-[15px] leading-relaxed">
            La plupart des créateurs solo abandonnent en moins de 90 jours.
            Pas par manque de talent — par manque de{' '}
            <span className="text-white/75 font-medium">système</span>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className="bg-[#0C1018] border border-white/[0.06] rounded-2xl p-6 hover:border-red-500/20 transition-colors duration-300 flex flex-col cursor-default"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/15 mb-5">
                <p.icon className="h-[18px] w-[18px] text-red-400" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2 text-[15px]">{p.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed flex-1 mb-4">{p.body}</p>
              <div className="text-[11px] text-orange-400/60 bg-orange-500/[0.06] border border-orange-500/[0.1] rounded-lg px-3 py-2 italic">
                &ldquo;{p.stat}&rdquo;
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bridge to solution */}
        <motion.div {...fadeIn(0.1)} className="text-center space-y-4">
          <p className="text-white/55 text-base">
            Et si tu avais un{' '}
            <span className="text-white font-semibold">assistant IA</span> qui gérait tout ça pour toi ?
          </p>
          <a href="#features" className="cursor-pointer">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#29AAE2]/70 hover:text-[#29AAE2] hover:bg-[#29AAE2]/[0.06] rounded-full gap-1.5 text-[13px] cursor-pointer transition-colors duration-200"
            >
              Découvrir la solution <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── DESIRE — Comparison ────────────────────────────────────────────── */
function ComparisonSection() {
  const without = [
    '2-3h pour trouver quoi publier',
    'Inconstance visible par l\'algorithme',
    'Scripts éparpillés dans des notes',
    'Aucune mesure de ta progression',
    "Abandon au bout de 90 jours",
  ]
  const withKam = [
    '15 idées générées en 30 secondes',
    'Planning automatique chaque semaine',
    'Script + description + hashtags intégrés',
    'Score de constance en temps réel',
    'Publie encore 12 mois après',
  ]

  return (
    <section className="py-20 bg-[#0C1018]">
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            La différence est réelle
          </h2>
          <p className="text-white/40 text-[14px]">Ce que vivent nos créateurs avant et après KamContent</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Without */}
          <motion.div
            {...fadeUp(0.05)}
            className="bg-[#07090F] border border-red-500/[0.12] rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <XCircle className="h-4 w-4 text-red-500/60" />
              <span className="text-sm font-semibold text-red-400/60">Sans KamContent</span>
            </div>
            <ul className="space-y-3">
              {without.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-white/35">
                  <XCircle className="h-4 w-4 text-red-500/30 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* With */}
          <motion.div
            {...fadeUp(0.12)}
            className="bg-[#07090F] border border-[#29AAE2]/20 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#29AAE2]/[0.02] pointer-events-none" />
            <div className="flex items-center gap-2 mb-5 relative">
              <CheckCircle2 className="h-4 w-4 text-[#29AAE2]" />
              <span className="text-sm font-semibold text-[#29AAE2]">Avec KamContent</span>
            </div>
            <ul className="space-y-3 relative">
              {withKam.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-[#29AAE2] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── DESIRE — Features ──────────────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      color: '#29AAE2',
      title: 'Brain IA',
      body: '15 idées générées en 30 secondes, calibrées pour tes niches, canaux et langue.',
      points: ['Filtres format & canal', 'Ajoute tes propres idées', 'Mode ajout sans effacer'],
    },
    {
      icon: Calendar,
      color: '#8B5CF6',
      title: 'Planner',
      body: 'Planifie ta semaine visuellement. Déplace, reporte ou supprime en un glissé.',
      points: ['Vue hebdomadaire drag & drop', 'Reporter S+1 en 1 clic', 'Statuts temps réel'],
    },
    {
      icon: FileText,
      color: '#F59E0B',
      title: 'Script IA',
      body: 'Script complet, description optimisée et hashtags — prêts à copier-coller.',
      points: ['Structure pro : intro → CTA', 'Export PDF', 'Régénère avec tes instructions'],
    },
    {
      icon: BarChart3,
      color: '#10B981',
      title: 'Tracker',
      body: 'Score de constance, streak et graphiques pour visualiser ta progression réelle.',
      points: ['Streak + meilleur record', 'Score mensuel automatique', 'Graphique hebdomadaire'],
    },
    {
      icon: Zap,
      color: '#EF4444',
      title: 'Canaux & Rappels',
      body: 'Connecte tous tes réseaux et reçois des rappels Telegram personnalisés.',
      points: ['TikTok · YouTube · Instagram · LinkedIn', "Rappels à l'heure que tu choisis", 'Bilan IA chaque semaine'],
    },
  ]

  return (
    <section id="features" className="py-24 bg-[#07090F]">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-white/35" />
            <span className="text-xs text-white/35 font-medium tracking-wide">Tout-en-un</span>
          </div>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-white mb-4 tracking-tight">
            Ton studio de contenu IA,{' '}
            <span className="bg-gradient-to-r from-[#29AAE2] to-[#8B5CF6] bg-clip-text text-transparent">
              intégré
            </span>
          </h2>
          <p className="text-white/45 max-w-xl mx-auto text-[15px]">
            5 modules qui couvrent l&apos;intégralité du cycle de création — de l&apos;idée à la publication.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.07)}
              className="bg-[#0C1018] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300 group cursor-default"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${f.color}18`, border: `1px solid ${f.color}22` }}
              >
                <f.icon className="h-5 w-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-display font-bold text-white text-[17px] mb-2">{f.title}</h3>
              <p className="text-[13.5px] text-white/45 leading-relaxed mb-5">{f.body}</p>
              <ul className="space-y-1.5">
                {f.points.map((pt, j) => (
                  <li key={j} className="flex items-center gap-2 text-[12px] text-white/35">
                    <Check className="h-3.5 w-3.5 shrink-0" style={{ color: f.color }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── DESIRE — How it works ──────────────────────────────────────────── */
function HowSection() {
  const steps = [
    {
      n: '01',
      icon: Target,
      title: 'Configure ton profil',
      body: "Renseigne tes niches, canaux et langue en 2 minutes. KamContent s'adapte à ton univers et ton audience.",
      time: '2 min',
    },
    {
      n: '02',
      icon: Brain,
      title: 'Génère et sélectionne tes idées',
      body: "L'IA génère 15 sujets calibrés. Sélectionne tes 3 préférés — ils sont automatiquement planifiés dans la semaine.",
      time: '5 min',
    },
    {
      n: '03',
      icon: TrendingUp,
      title: 'Crée, publie, mesure',
      body: 'Génère le script, publie, coche "Publié". Le Tracker calcule ton score de constance chaque semaine.',
      time: '3 min',
    },
  ]

  return (
    <section id="how" className="py-24 bg-[#0C1018]">
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs text-white/35 font-medium tracking-wide">Démarrage rapide</span>
          </div>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-white mb-4 tracking-tight">
            Prêt à publier en 10 minutes
          </h2>
          <p className="text-white/45 max-w-lg mx-auto text-[15px]">
            Pas de courbe d&apos;apprentissage. Tu publies ton premier contenu le jour même.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[26px] top-10 bottom-10 w-px bg-gradient-to-b from-[#29AAE2]/30 via-[#29AAE2]/10 to-transparent hidden sm:block" />

          <div className="space-y-10">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.12)}
                className="flex items-start gap-5 sm:gap-7"
              >
                <div className="relative shrink-0">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#29AAE2]/10 border border-[#29AAE2]/20">
                    <s.icon className="h-5 w-5 text-[#29AAE2]" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0C1018] border border-white/10 text-[9px] font-bold text-white/40">
                    {i + 1}
                  </span>
                </div>
                <div className="pt-1.5 flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-display text-[2.8rem] font-bold text-white/[0.04] leading-none select-none">
                      {s.n}
                    </span>
                    <h3 className="font-display font-bold text-white text-[18px]">{s.title}</h3>
                    <span className="text-[10px] text-[#29AAE2]/60 bg-[#29AAE2]/[0.08] border border-[#29AAE2]/15 rounded-full px-2 py-0.5">
                      {s.time}
                    </span>
                  </div>
                  <p className="text-[14px] text-white/45 leading-relaxed max-w-lg">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mid-page CTA */}
        <motion.div {...fadeUp(0.3)} className="text-center mt-14">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-full px-8 h-12 text-[15px] font-semibold shadow-xl shadow-[#29AAE2]/25 gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Commencer maintenant — c&apos;est gratuit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── DESIRE — Results numbers ───────────────────────────────────────── */
function ResultsSection() {
  const stats = [
    { end: 500, suffix: '+', label: 'Créateurs actifs', sub: 'Afrique & Europe' },
    { end: 75000, suffix: '+', label: 'Idées générées', sub: 'Depuis le lancement' },
    { end: 92, suffix: '%', label: 'Taux de constance', sub: 'Chez nos utilisateurs actifs' },
  ]

  return (
    <section className="py-16 bg-[#07090F] border-y border-white/[0.05]">
      <div className="max-w-4xl mx-auto px-5">
        <motion.p
          {...fadeUp()}
          className="text-center text-[11px] text-white/25 uppercase tracking-widest mb-10 font-medium"
        >
          Nos créateurs en chiffres
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="space-y-1">
              <p className="font-display text-4xl md:text-5xl font-bold text-white">
                <Counter end={s.end} suffix={s.suffix} />
              </p>
              <p className="text-[15px] font-semibold text-white/70">{s.label}</p>
              <p className="text-[12px] text-white/25">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── DESIRE — Testimonials ──────────────────────────────────────────── */
function Testimonials() {
  const quotes = [
    {
      text: "Avant KamContent, je cherchais mes idées pendant des heures. Maintenant j'ai ma semaine planifiée en 10 minutes. La différence est énorme.",
      name: 'Aminata K.',
      role: 'Créatrice finance perso · TikTok',
      initials: 'AK',
      color: '#29AAE2',
      result: '+60% de constance en 3 semaines',
    },
    {
      text: "Le script IA est bluffant. Il me génère une structure complète avec l'accroche et les hashtags. J'ai gagné au moins 3h de travail par semaine.",
      name: 'Jean-Marc T.',
      role: 'Coach entrepreneuriat · YouTube',
      initials: 'JT',
      color: '#8B5CF6',
      result: '3h économisées / semaine',
    },
    {
      text: "Le Tracker m'a donné une vision honnête de ma constance. J'étais à 40%... maintenant je suis à 80%. Mesurer ça change vraiment le comportement.",
      name: 'Fatoumata D.',
      role: 'Créatrice lifestyle · Instagram',
      initials: 'FD',
      color: '#10B981',
      result: 'Constance x2 en 30 jours',
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-[#0C1018]">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-6">
            <Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-xs text-white/35 font-medium">Témoignages</span>
          </div>
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-white mb-4 tracking-tight">
            Des créateurs qui publient{' '}
            <span className="text-[#29AAE2]">avec constance</span>
          </h2>
          <p className="text-white/45 max-w-md mx-auto text-[15px]">
            Rejoins des créateurs francophones qui ont transformé leur façon de créer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className="bg-[#07090F] border border-white/[0.06] rounded-2xl p-6 flex flex-col hover:border-white/[0.1] transition-colors duration-300 cursor-default"
            >
              {/* Result badge */}
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 w-fit text-[10px] font-semibold"
                style={{
                  backgroundColor: q.color + '15',
                  color: q.color,
                  border: `1px solid ${q.color}25`,
                }}
              >
                <TrendingUp className="h-3 w-3" />
                {q.result}
              </div>

              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <Quote className="h-5 w-5 text-white/[0.1] mb-3" />
              <p className="text-[13.5px] text-white/60 leading-relaxed flex-1 mb-6">{q.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold shrink-0"
                  style={{ backgroundColor: q.color + '25', color: q.color }}
                >
                  {q.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{q.name}</p>
                  <p className="text-[11px] text-white/35">{q.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Objection handling (FAQ) ──────────────────────────────────────── */
function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const faqs = [
    {
      q: "C'est vraiment gratuit ?",
      a: "Oui. Les 15 idées IA par semaine, le planner, et le tracker sont gratuits pour toujours. Aucun paywall caché.",
    },
    {
      q: "Je peux annuler n'importe quand ?",
      a: "Tu n'es inscrit à rien. Pas d'abonnement. Crée un compte, utilise l'app, c'est tout. Zéro engagement.",
    },
    {
      q: 'Ça fonctionne pour tous les créateurs ?',
      a: "Oui, mais c'est optimisé pour les niches africaines et européennes : entrepreneuriat, finance, lifestyle, tech, coaching, etc.",
    },
    {
      q: "L'IA génère vraiment du contenu en français ?",
      a: "Absolument. KamContent est conçu pour les créateurs francophones. Les idées, scripts et hashtags sont tous générés en français.",
    },
  ]

  return (
    <section className="py-20 bg-[#07090F]">
      <div className="max-w-2xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-10">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
            Questions fréquentes
          </h3>
          <p className="text-white/35 text-[14px]">Tout ce que tu veux savoir avant de commencer.</p>
        </motion.div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.06)}
              className="bg-[#0C1018] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.1] transition-colors duration-200 cursor-pointer"
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
            >
              <div className="flex items-center justify-between px-5 py-4 gap-4">
                <p className="font-semibold text-white text-[14px]">{faq.q}</p>
                <ChevronRight
                  className={`h-4 w-4 text-white/30 shrink-0 transition-transform duration-200 ${openIdx === i ? 'rotate-90' : ''}`}
                />
              </div>
              {openIdx === i && (
                <div className="px-5 pb-4">
                  <p className="text-[13px] text-white/45 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── ACTION — Final CTA ─────────────────────────────────────────────── */
function CTASection() {
  const included = [
    '15 idées IA générées / semaine',
    'Planner hebdomadaire drag-and-drop',
    'Script complet + description + hashtags',
    'Tracker de constance avec streak',
    '5 canaux connectés (TikTok, YouTube, etc)',
    "Rappels Telegram à l'heure que tu choisis",
  ]

  const avatars = [
    { init: 'AK', color: '#29AAE2' },
    { init: 'JT', color: '#8B5CF6' },
    { init: 'FD', color: '#10B981' },
    { init: 'MB', color: '#F59E0B' },
    { init: 'OL', color: '#EF4444' },
  ]

  return (
    <section className="py-24 bg-[#0C1018] relative overflow-hidden">
      {/* Glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[300px] bg-[#29AAE2]/[0.07] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-xl mx-auto px-5 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-8">
          {/* Avatar stack + social proof */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              {avatars.map((a, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#0C1018] flex items-center justify-center text-[9px] font-bold"
                  style={{ backgroundColor: a.color + '50', color: a.color }}
                >
                  {a.init}
                </div>
              ))}
            </div>
            <span className="text-[12px] text-white/40">Rejoins 500+ créateurs actifs</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Lance-toi.{' '}
            <span className="bg-gradient-to-r from-[#29AAE2] to-[#38BEF0] bg-clip-text text-transparent">
              C&apos;est gratuit.
            </span>
          </h2>
          <p className="text-white/45 text-base">
            Arrête de chercher quoi créer. Commence à publier — dès aujourd&apos;hui.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="bg-[#07090F] border border-white/[0.08] rounded-2xl p-7 sm:p-8"
        >
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {included.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#29AAE2]/15 border border-[#29AAE2]/20 shrink-0">
                  <Check className="h-3 w-3 text-[#29AAE2]" />
                </div>
                <span className="text-[13.5px] text-white/65">{item}</span>
              </li>
            ))}
          </ul>

          <Link href="/register">
            <Button
              size="lg"
              className="w-full bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-xl h-12 text-[15px] font-semibold shadow-lg shadow-[#29AAE2]/20 gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Génère tes 15 idées gratuitement (30 sec)
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-[11px] text-white/25 text-center mt-4">
            Inscription gratuite · 30 idées bonus la première semaine · Accès immédiat
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#07090F]">
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="KamContent" className="h-7 w-7 rounded-xl" />
            <span className="font-display font-bold text-white text-[15px]">KamContent</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-7">
            {[
              { label: 'Fonctionnalités', href: '#features' },
              { label: 'Comment ça marche', href: '#how' },
              { label: 'Témoignages', href: '#testimonials' },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/35 hover:text-white/70 text-xs h-7 cursor-pointer">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-white/[0.07] hover:bg-white/[0.11] text-white border border-white/10 text-xs h-7 cursor-pointer transition-colors duration-200"
              >
                Commencer
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.05] text-center">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} KamContent — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Sticky mobile CTA ──────────────────────────────────────────────── */
function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-5 inset-x-5 z-40 md:hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/register">
          <Button
            size="lg"
            className="w-full bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-2xl h-12 text-[15px] font-semibold shadow-2xl shadow-[#29AAE2]/40 gap-2 cursor-pointer"
          >
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

/* ─── Main export ────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090F]">
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <ComparisonSection />
      <FeaturesSection />
      <HowSection />
      <ResultsSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <Footer />
      <StickyMobileCTA />
    </div>
  )
}
