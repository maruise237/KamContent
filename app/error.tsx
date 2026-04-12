'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log en prod — remplacer par Sentry si besoin
    console.error('[KamContent error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#07090F] flex flex-col relative overflow-hidden">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

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

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-display text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight"
          >
            Une erreur est survenue
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-white/50 text-[15px] leading-relaxed mb-8 max-w-sm mx-auto"
          >
            Quelque chose s&apos;est mal passé de notre côté. Tes données sont en sécurité — réessaie dans un instant.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button
              onClick={reset}
              className="bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-full px-6 h-11 text-[14px] font-semibold shadow-lg shadow-[#29AAE2]/20 gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-white/50 hover:text-white hover:bg-white/[0.06] rounded-full px-5 h-11 text-[14px] gap-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Tableau de bord
              </Button>
            </Link>
          </motion.div>

          {/* Error digest for debugging */}
          {error.digest && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-xs text-white/15 font-mono"
            >
              Code : {error.digest}
            </motion.p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] py-5">
        <p className="text-center text-xs text-white/20">
          © {new Date().getFullYear()} KamContent
        </p>
      </footer>
    </div>
  )
}
