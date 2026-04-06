'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Brain, CalendarDays, BarChart2, Radio, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
  { href: '/dashboard/brain', icon: Brain, label: 'Brain' },
  { href: '/dashboard/planner', icon: CalendarDays, label: 'Planner' },
  { href: '/dashboard/tracker', icon: BarChart2, label: 'Tracker' },
  { href: '/dashboard/channels', icon: Radio, label: 'Canaux' },
  { href: '/dashboard/settings', icon: SlidersHorizontal, label: 'Paramètres' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border/50 bg-card">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border/50 px-5">
          <Image src="/logo.svg" alt="KamContent" width={51} height={28} className="rounded-md" />
          <span className="text-sm font-semibold tracking-tight">KamContent</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all duration-100',
                  isActive
                    ? 'bg-primary/8 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-[15px] w-[15px] shrink-0" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto h-1 w-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/50 p-4">
          <p className="text-[11px] text-muted-foreground/60 text-center tracking-wide uppercase">
            KAMTECH IA
          </p>
        </div>
      </aside>

      {/* Navigation mobile — grande, utilisable */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border/50 bg-card/98 backdrop-blur-md md:hidden safe-area-pb">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1.5 py-3 min-h-[60px] text-[11px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-b-full mx-2" />
              )}
              <item.icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
