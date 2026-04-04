'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GenerateButtonProps {
  onClick: () => void
  loading: boolean
}

export function GenerateButton({ onClick, loading }: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      size="lg"
      className="gap-2 bg-primary hover:bg-primary/90"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Génération en cours...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          Générer les sujets de la semaine
        </>
      )}
    </Button>
  )
}
