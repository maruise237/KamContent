export const dynamic = 'force-dynamic'
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="KamContent" width={51} height={28} className="rounded-md" />
          <span className="font-display text-2xl font-bold">KamContent</span>
        </div>

        <SignIn
          appearance={{
            elements: {
              card: 'bg-card border border-border shadow-sm rounded-lg',
              headerTitle: 'font-display text-2xl font-semibold text-foreground',
              headerSubtitle: 'text-muted-foreground',
              formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
          }}
        />
      </div>
    </div>
  )
}
