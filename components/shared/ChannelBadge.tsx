import { cn, CHANNEL_COLORS, CHANNEL_LABELS } from '@/lib/utils'

interface ChannelBadgeProps {
  channel: string
  className?: string
}

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  const color = CHANNEL_COLORS[channel] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
  const label = CHANNEL_LABELS[channel] ?? channel

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
