import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Toaster } from 'sonner'
import Script from 'next/script'
import './globals.css'

const BASE_URL = 'https://kamcontent.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'KamContent — Arrête de réfléchir à quoi poster',
    template: '%s — KamContent',
  },
  description: 'Génère tes idées et scripts de contenu IA, planifie ton calendrier éditorial et suis ta constance de publication. Gratuit pendant la bêta.',
  keywords: ['création de contenu', 'idées contenu IA', 'script TikTok', 'calendrier éditorial', 'YouTube', 'constance créateur', 'KamContent'],
  authors: [{ name: 'KamContent' }],
  creator: 'KamContent',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'KamContent',
    title: 'KamContent — Arrête de réfléchir à quoi poster',
    description: 'Génère tes idées et scripts de contenu IA, planifie ton calendrier éditorial et suis ta constance. Gratuit pendant la bêta.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KamContent — Arrête de réfléchir à quoi poster',
    description: 'Génère tes idées et scripts de contenu IA, planifie ton calendrier éditorial et suis ta constance. Gratuit pendant la bêta.',
    creator: '@kamcontent',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wagxfihwlf");`,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
