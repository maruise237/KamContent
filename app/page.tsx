import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { LandingPage } from '@/components/landing/LandingPage'

export const metadata = {
  title: 'KamContent — Crée du contenu qui performe chaque semaine',
  description:
    'KamContent génère tes idées IA, planifie ta semaine et mesure ta constance — pour que tu ne sèches plus jamais sur quoi publier.',
}

export default async function RootPage() {
  const user = await currentUser()
  if (user) redirect('/dashboard')
  return <LandingPage />
}
