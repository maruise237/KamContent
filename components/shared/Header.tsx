'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface HeaderProps {
  user: SupabaseUser
  profile: Profile | null
}

export function Header({ user, profile }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const displayName = profile?.full_name ?? user.email?.split('@')[0] ?? 'Utilisateur'

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium leading-none">{displayName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Changer de thème"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          disabled={loading}
          aria-label="Se déconnecter"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
