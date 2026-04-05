'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, LayoutDashboard, Brain, CalendarDays, BarChart2, Radio, SlidersHorizontal } from 'lucide-react'
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
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

      {/* Navigation mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border/50 bg-card/95 backdrop-blur md:hidden">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden xs:block">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
