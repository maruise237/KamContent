'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Brain, Calendar, BarChart3, Settings, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Accueil' },
  { href: '/dashboard/brain', icon: Brain, label: 'Brain' },
  { href: '/dashboard/planner', icon: Calendar, label: 'Planner' },
  { href: '/dashboard/tracker', icon: BarChart3, label: 'Tracker' },
  { href: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold">KamContent</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            Propulsé par KAMTECH IA
          </p>
        </div>
      </aside>

      {/* Navigation mobile (bas de page) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card md:hidden">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden xs:block">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
