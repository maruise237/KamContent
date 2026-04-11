'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Brain, Calendar, BarChart3, Zap, Target, TrendingUp,
  ChevronRight, Check, Sparkles, ArrowRight, Menu, X,
  Play, Star, Quote, MessageSquare, Hash, FileText,
  Clock, RefreshCw, Flame
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
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
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
              className="text-[13.5px] text-white/50 hover:text-white/90 transition-colors"
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
              className="text-white/50 hover:text-white hover:bg-white/[0.06] text-[13px] h-8"
            >
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-full h-8 px-4 text-[13px] font-semibold shadow-lg shadow-[#29AAE2]/25 gap-1"
            >
              Commencer gratuitement
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/60 hover:text-white p-1.5"
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
                className="text-sm text-white/60"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-2.5">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" size="sm" className="w-full border-white/10 text-white/70 text-sm">
                Se connecter
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full bg-[#29AAE2] text-white text-sm">
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
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#29AAE2]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[100px]" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-5 w-full relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge — ATTENTION + Trust signal */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#29AAE2]/[0.12] border border-[#29AAE2]/25 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#29AAE2]" />
            <span className="text-xs text-[#29AAE2] font-medium tracking-wide">
              ✓ Utilisé par 500+ créateurs en Afrique et Europe
            </span>
          </motion.div>

          {/* Headline — ATTENTION */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[2.6rem] sm:text-6xl md:text-[4.2rem] font-bold text-white leading-[1.1] tracking-tight mb-6"
          >
            Crée du contenu{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#29AAE2] via-[#38BEF0] to-[#7DCFF5] bg-clip-text text-transparent">
                qui performe
              </span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6 C40 2, 80 1, 120 3 C160 5, 190 4, 198 3"
                  stroke="#29AAE2"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>
            {' '}chaque semaine.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="text-[1.05rem] sm:text-lg text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            KamContent génère tes idées IA, planifie ta semaine et mesure ta constance —
            pour que tu ne sèches plus jamais sur quoi publier.
          </motion.p>

          {/* CTAs — ACTION with benefit-driven copy + risk reversal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-full px-8 h-12 text-[15px] font-semibold shadow-xl shadow-[#29AAE2]/25 gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Planifier ma première semaine →
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#how">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-full px-6 h-12 text-[15px] gap-2"
              >
                <Play className="h-4 w-4" />
                Voir la démo (2 min)
              </Button>
            </a>
          </motion.div>

          {/* Risk reversal + Urgency signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 text-xs text-white/40"
          >
            <span>✓ Aucune carte de crédit</span>
            <span className="hidden sm:block w-px h-3.5 bg-white/10" />
            <span>✓ Gratuit pour toujours (idées illimitées)</span>
            <span className="hidden sm:block w-px h-3.5 bg-white/10" />
            <span>✓ Premiers 3 jours : 30 idées bonus</span>
          </motion.div>

          {/* App mockup */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Social proof badge — urgency/FOMO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center justify-center gap-1.5 text-[11px] text-orange-400/80 bg-orange-500/[0.08] border border-orange-500/[0.15] rounded-full px-3 py-1 mb-8 mx-auto w-fit"
        >
          <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
          4 nouveaux créateurs inscrit cette semaine
        </motion.div>

        <div className="relative max-w-3xl mx-auto rounded-2xl border border-white/[0.08] bg-[#0C1018] shadow-2xl shadow-black/60 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#141824] border-b border-white/[0.06]">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                <div className="ml-3 flex-1 bg-[#0C1018] rounded h-5 flex items-center px-3 max-w-[240px]">
                  <span className="text-[10px] text-white/20">app.kamcontent.com/dashboard/brain</span>
                </div>
              </div>

              {/* Content preview */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                    <div className="h-5 w-20 bg-white/[0.08] rounded-md" />
                    <div className="h-3 w-52 bg-white/[0.04] rounded-md" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-white/[0.05] rounded-lg" />
                    <div className="h-8 w-32 bg-[#29AAE2]/20 border border-[#29AAE2]/20 rounded-full" />
                  </div>
                </div>

                {/* Topic cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { w: '3/4', tag: 'TikTok', badge: 'Court' },
                    { w: 'full', tag: 'YouTube', badge: 'Long' },
                    { w: '4/5', tag: 'LinkedIn', badge: 'Texte' },
                    { w: '2/3', tag: 'Instagram', badge: 'Court' },
                    { w: 'full', tag: 'TikTok', badge: 'Court' },
                    { w: '3/4', tag: 'YouTube', badge: 'Long' },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.07 }}
                      className="rounded-xl bg-[#141824] border border-white/[0.06] p-3.5 space-y-2"
                    >
                      <div className={`h-2.5 bg-white/[0.09] rounded w-${card.w}`} />
                      <div className="h-2 bg-white/[0.05] rounded w-full" />
                      <div className="h-2 bg-white/[0.05] rounded w-4/5" />
                      <div className="flex gap-1.5 pt-1">
                        <span className="h-4 px-2 bg-[#29AAE2]/15 text-[#29AAE2] rounded-full text-[9px] flex items-center font-medium">
                          {card.tag}
                        </span>
                        <span className="h-4 px-2 bg-white/[0.05] text-white/30 rounded-full text-[9px] flex items-center">
                          {card.badge}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#07090F] to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Trust bar ──────────────────────────────────────────────────────── */
function TrustBar() {
  const items = [
    { icon: Zap, value: '15 idées', sub: 'générées en 30 secondes' },
    { icon: Calendar, value: '1 clic', sub: 'pour planifier la semaine' },
    { icon: Target, value: '5 canaux', sub: 'supportés nativement' },
    { icon: Flame, value: 'Streak', sub: 'mesuré chaque semaine' },
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
      stat: "72% des créateurs abandonnent en moins de 90 jours",
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
      body: "Sans données claires, tu devines. Est-ce que c'est tes hashtags? Le timing? Le format? Tu tournes en rond depuis 6 mois.",
      stat: 'Les créateurs mesurés croissent 5x plus vite',
    },
  ]

  return (
    <section className="py-24 bg-[#07090F]">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-white mb-4 tracking-tight">
            Tu te reconnais là-dedans ?
          </h2>
          <p className="text-white/45 max-w-xl mx-auto text-[15px] leading-relaxed">
            La plupart des créateurs solo abandonnent en moins de 90 jours.
            Pas par manque de talent — par manque de <span className="text-white/70">système</span>.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className="bg-[#0C1018] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-colors flex flex-col"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/15 mb-5">
                <p.icon className="h-[18px] w-[18px] text-red-400" />
              </div>
              <h3 className="font-display font-semibold text-white mb-2 text-[15px]">{p.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed flex-1 mb-4">{p.body}</p>
              <div className="text-[11px] text-orange-400/60 bg-orange-500/[0.06] border border-orange-500/[0.1] rounded-lg px-3 py-2 italic">
                "{p.stat}"
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bridge to solution */}
        <motion.div {...fadeIn(0.1)} className="text-center">
          <p className="text-white/55 text-base">
            Et si tu avais un{' '}
            <span className="text-white font-semibold">assistant IA</span> qui gérait tout ça pour toi ?
          </p>
        </motion.div>
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
      span: 'md:col-span-2 lg:col-span-1',
    },
    {
      icon: Calendar,
      color: '#8B5CF6',
      title: 'Planner',
      body: 'Planifie ta semaine visuellement. Déplace, reporte ou supprime en un glissé.',
      points: ['Vue hebdomadaire drag & drop', 'Reporter S+1 en 1 clic', 'Statuts temps réel'],
      span: '',
    },
    {
      icon: FileText,
      color: '#F59E0B',
      title: 'Script IA',
      body: 'Script complet, description optimisée et hashtags — prêts à copier-coller.',
      points: ['Structure pro : intro → CTA', 'Export PDF', 'Régénère avec tes instructions'],
      span: '',
    },
    {
      icon: BarChart3,
      color: '#10B981',
      title: 'Tracker',
      body: 'Score de constance, streak et graphiques pour visualiser ta progression réelle.',
      points: ['Streak + meilleur record', 'Score mensuel automatique', 'Graphique hebdomadaire'],
      span: '',
    },
    {
      icon: Zap,
      color: '#EF4444',
      title: 'Canaux & Rappels',
      body: 'Connecte tous tes réseaux et reçois des rappels Telegram personnalisés.',
      points: ['TikTok · YouTube · Instagram · LinkedIn', "Rappels à l'heure que tu choisis", 'Bilan IA chaque semaine'],
      span: '',
    },
  ]

  return (
    <section id="features" className="py-24 bg-[#0C1018]">
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
            5 modules qui couvrent l'intégralité du cycle de création — de l'idée à la publication.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.07)}
              className={`bg-[#07090F] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.11] transition-all group ${f.span}`}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${f.color}18`, border: `1px solid ${f.color}22` }}
              >
                <f.icon className="h-5 w-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-display font-bold text-white text-[17px] mb-2">{f.title}</h3>
              <p className="text-[13.5px] text-white/45 leading-relaxed mb-5">{f.body}</p>
              <ul className="space-y-1.5">
                {f.points.map((pt, j) => (
                  <li key={j} className="flex items-center gap-2 text-[12px] text-white/35">
                    <Check className="h-3.5 w-3.5 text-[#29AAE2] shrink-0" />
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
    },
    {
      n: '02',
      icon: Brain,
      title: 'Génère et sélectionne tes idées',
      body: "L'IA génère 15 sujets calibrés. Sélectionne tes 3 préférés — ils sont automatiquement planifiés dans la semaine.",
    },
    {
      n: '03',
      icon: TrendingUp,
      title: 'Crée, publie, mesure',
      body: 'Génère le script, publie, coche "Publié". Le Tracker calcule ton score de constance chaque semaine.',
    },
  ]

  return (
    <section id="how" className="py-24 bg-[#07090F]">
      <div className="max-w-4xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-[2.5rem] font-bold text-white mb-4 tracking-tight">
            Démarre en 3 étapes
          </h2>
          <p className="text-white/45 max-w-lg mx-auto text-[15px]">
            Pas de courbe d'apprentissage. Tu publies ton premier contenu le jour même.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
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
                <div className="pt-1.5">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-display text-[2.8rem] font-bold text-white/[0.04] leading-none select-none">
                      {s.n}
                    </span>
                    <h3 className="font-display font-bold text-white text-[18px]">{s.title}</h3>
                  </div>
                  <p className="text-[14px] text-white/45 leading-relaxed max-w-lg">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
    },
    {
      text: "Le script IA est bluffant. Il me génère une structure complète avec l'accroche et les hashtags. J'ai gagné au moins 3h de travail par semaine.",
      name: 'Jean-Marc T.',
      role: 'Coach entrepreneuriat · YouTube',
      initials: 'JT',
    },
    {
      text: "Le Tracker m'a donné une vision honnête de ma constance. J'étais à 40%... maintenant je suis à 80%. Mesurer ça change vraiment le comportement.",
      name: 'Fatoumata D.',
      role: 'Créatrice lifestyle · Instagram',
      initials: 'FD',
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-[#0C1018]">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div {...fadeUp()} className="text-center mb-16">
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
              className="bg-[#07090F] border border-white/[0.06] rounded-2xl p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <Quote className="h-5 w-5 text-white/[0.12] mb-3" />
              <p className="text-[13.5px] text-white/60 leading-relaxed flex-1 mb-6">{q.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#29AAE2]/20 text-[#29AAE2] text-xs font-bold shrink-0">
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
  const faqs = [
    {
      q: "C'est vraiment gratuit ?",
      a: 'Oui. Les 15 idées IA par semaine, le planner, et le tracker sont gratuits pour toujours. Aucun paywall caché.',
    },
    {
      q: "Je peux annuler n'importe quand ?",
      a: "Tu n'es inscrit à rien. Pas d'abonnement. Crée un compte, utilise l'app, c'est tout. Zéro engagement.",
    },
    {
      q: 'Ça fonctionne pour tous les créateurs ?',
      a: "Oui, mais c'est optimisé pour les niches africaines et européennes : entrepreneuriat, finance, lifestyle, tech, coaching, etc.",
    },
  ]

  return (
    <section className="py-16 bg-[#0C1018]">
      <div className="max-w-2xl mx-auto px-5">
        <motion.h3 {...fadeUp()} className="font-display text-2xl font-bold text-white mb-8 text-center">
          Questions fréquentes
        </motion.h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.08)}
              className="bg-[#07090F] border border-white/[0.06] rounded-xl p-4"
            >
              <p className="font-semibold text-white text-[14px] mb-2">{faq.q}</p>
              <p className="text-[13px] text-white/45 leading-relaxed">{faq.a}</p>
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

  return (
    <section className="py-24 bg-[#07090F] relative overflow-hidden">
      {/* Glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[300px] bg-[#29AAE2]/[0.07] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-2xl mx-auto px-5 relative z-10">
        <motion.div {...fadeUp()} className="text-center mb-10">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Lance-toi.{' '}
            <span className="bg-gradient-to-r from-[#29AAE2] to-[#38BEF0] bg-clip-text text-transparent">
              C'est gratuit.
            </span>
          </h2>
          <p className="text-white/45 text-base">
            Arrête de chercher quoi créer. Commence à publier.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.1)}
          className="bg-[#0C1018] border border-white/[0.08] rounded-2xl p-7 sm:p-8"
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
              className="w-full bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-xl h-12 text-[15px] font-semibold shadow-lg shadow-[#29AAE2]/20 gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Génère tes 15 idées gratuitement (30 sec)
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-[11px] text-white/25 text-center mt-4">
            Inscription gratuite • 30 idées bonus la première semaine • Accès immédiat
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
          <Link href="/" className="flex items-center gap-2.5">
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
              <a key={l.href} href={l.href} className="text-sm text-white/30 hover:text-white/60 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/35 hover:text-white/70 text-xs h-7">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-white/[0.07] hover:bg-white/[0.11] text-white border border-white/10 text-xs h-7">
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

/* ─── Main export ────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090F]">
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <FeaturesSection />
      <HowSection />
      <Testimonials />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
