import { cn, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  const label = STATUS_LABELS[status] ?? status

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        color,
        className
      )}
    >
      {label}
    </span>
  )
}
