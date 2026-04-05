import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'KamContent — Arrête de réfléchir à quoi poster',
  description: 'Génère des sujets de vidéos, organise ton calendrier éditorial et suis ta constance de publication.',
  keywords: ['création de contenu', 'calendrier éditorial', 'TikTok', 'YouTube', 'constance'],
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
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
