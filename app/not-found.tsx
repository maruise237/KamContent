'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Home, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090F] flex flex-col relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#29AAE2]/[0.05] rounded-full blur-[120px]" />
      </div>

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="KamContent" className="h-7 w-7 rounded-xl" />
            <span className="font-display font-bold text-white text-[15px] tracking-tight">KamContent</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-lg w-full text-center">

          {/* 404 number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="font-display text-[7rem] font-bold leading-none text-white/[0.04] select-none">
              404
            </span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#29AAE2]/10 border border-[#29AAE2]/20 mx-auto mb-6 -mt-8"
          >
            <Brain className="h-6 w-6 text-[#29AAE2]" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight"
          >
            Cette page n&apos;existe pas
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-white/50 text-[15px] leading-relaxed mb-10 max-w-sm mx-auto"
          >
            Pas de panique — tu n&apos;es pas perdu. Retourne à l&apos;accueil ou commence
            directement à générer tes idées de contenu.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-full px-7 h-11 text-[14px] font-semibold shadow-xl shadow-[#29AAE2]/25 gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                Générer mes idées gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-full px-5 h-11 text-[14px] gap-2 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Accueil
              </Button>
            </Link>
          </motion.div>

          {/* Social proof mini */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2"
          >
            <div className="flex -space-x-1.5">
              {['AK', 'JT', 'FD'].map((init, i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-full border border-[#07090F] flex items-center justify-center text-[7px] font-bold bg-[#29AAE2]/25 text-[#29AAE2]"
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/50">500+ créateurs publient déjà avec KamContent</span>
          </motion.div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="relative z-10 border-t border-white/[0.05] py-5">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} KamContent
          </p>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-xs text-white/25 hover:text-white/50 transition-colors flex items-center gap-1.5 cursor-pointer">
              <ArrowLeft className="h-3 w-3" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
