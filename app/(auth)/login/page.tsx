export const dynamic = 'force-dynamic'
import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-white font-bold text-lg">K</span>
          </div>
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
