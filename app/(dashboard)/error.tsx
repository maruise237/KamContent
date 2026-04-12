'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard error]', error)
  }, [error])

  return (
    <div className="flex flex-1 items-center justify-center min-h-[60vh] px-5">
      <div className="max-w-sm w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-5">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>

          <h2 className="font-display text-xl font-bold text-foreground mb-2 tracking-tight">
            Une erreur est survenue
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-7">
            Cette page a rencontré un problème. Tes données sont en sécurité — réessaie ou reviens au tableau de bord.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={reset}
              className="gap-2 rounded-xl"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
            <Button variant="ghost" asChild className="gap-2 rounded-xl">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
          </div>

          {error.digest && (
            <p className="mt-6 text-xs text-muted-foreground/30 font-mono">
              {error.digest}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
