import { cn } from '@/lib/utils'

interface LanguageBadgeProps {
  language: string
  className?: string
}

const LANGUAGE_COLORS: Record<string, string> = {
  fr: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  en: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  const color = LANGUAGE_COLORS[language] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase',
        color,
        className
      )}
    >
      {language}
    </span>
  )
}
