import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'KamContent — Arrête de réfléchir à quoi poster',
  description: 'Génère tes idées et scripts de contenu IA, planifie ton calendrier éditorial et suis ta constance de publication.',
  keywords: ['création de contenu', 'calendrier éditorial', 'TikTok', 'YouTube', 'constance'],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" richColors theme="dark" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
