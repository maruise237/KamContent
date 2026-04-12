export const dynamic = 'force-dynamic'

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const perks = [
  'Accès complet pendant la bêta — 100% gratuit',
  'Aucune carte bancaire requise',
  'Scripts illimités à lire face caméra',
  'Calendrier éditorial IA personnalisé',
  'Suivi de ta régularité de publication',
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#07090F] flex">

      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Left panel — branding (desktop) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 relative overflow-hidden border-r border-white/[0.05]">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#29AAE2]/[0.07] rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="KamContent" className="h-8 w-8 rounded-xl" />
          <span className="font-display font-bold text-white text-[17px] tracking-tight">KamContent</span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#29AAE2]/10 border border-[#29AAE2]/20 rounded-full px-3 py-1 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-[#29AAE2]">Bêta ouverte — rejoins gratuitement</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white leading-tight tracking-tight text-balance mb-4">
              Publie plus. Stresse moins. Croîs vite.
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed max-w-sm">
              En 30 secondes, tu as un compte. En 3 minutes, tu as ton premier script prêt à filmer.
            </p>
          </div>

          {/* Perks list */}
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#29AAE2] shrink-0" />
                <span className="text-white/65 text-sm">{perk}</span>
              </li>
            ))}
          </ul>

          {/* Social proof */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {['AK', 'JT', 'FD', 'ML'].map((init, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#07090F] flex items-center justify-center text-[9px] font-bold bg-[#29AAE2]/25 text-[#29AAE2]"
                >
                  {init}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white/70 text-sm font-semibold">500+ créateurs</p>
              <p className="text-white/35 text-xs">ont déjà rejoint la bêta</p>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="relative z-10">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-xs text-white/35 leading-relaxed max-w-xs">
            Les tarifs seront introduits après la bêta. Tu seras notifié 30 jours à l&apos;avance avec des conditions préférentielles pour les premiers inscrits.
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 relative z-10">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="KamContent" className="h-8 w-8 rounded-xl" />
            <span className="font-display font-bold text-white text-[17px] tracking-tight">KamContent</span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          {/* Heading above Clerk */}
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-white tracking-tight mb-1">
              Crée ton compte gratuit
            </h1>
            <p className="text-white/45 text-sm">
              Aucune carte requise · Accès immédiat
            </p>
          </div>

          <SignUp
            appearance={{
              variables: {
                colorPrimary: '#29AAE2',
                colorBackground: '#0C1018',
                colorInputBackground: 'rgba(255,255,255,0.05)',
                colorInputText: '#ffffff',
                colorText: '#ffffff',
                colorTextSecondary: 'rgba(255,255,255,0.45)',
                colorTextOnPrimaryBackground: '#ffffff',
                colorNeutral: 'rgba(255,255,255,0.1)',
                colorDanger: '#f87171',
                borderRadius: '0.75rem',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                spacingUnit: '1rem',
              },
              elements: {
                rootBox: 'w-full',
                card: 'bg-[#0C1018] border border-white/[0.08] shadow-xl shadow-black/40 rounded-2xl w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                header: 'hidden',
                socialButtonsBlockButton: 'border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white rounded-xl transition-all duration-200',
                socialButtonsBlockButtonText: 'text-white/80 font-medium',
                socialButtonsIconButton: 'border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-all duration-200',
                dividerLine: 'bg-white/[0.08]',
                dividerText: 'text-white/30 text-xs',
                formFieldLabel: 'text-white/60 text-xs font-medium uppercase tracking-wider',
                formFieldInput: 'bg-white/[0.05] border border-white/[0.1] text-white rounded-xl placeholder:text-white/25 focus:border-[#29AAE2] focus:ring-1 focus:ring-[#29AAE2]/30 transition-all',
                formButtonPrimary: 'bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-xl font-semibold shadow-lg shadow-[#29AAE2]/25 transition-all duration-200 hover:scale-[1.01]',
                footerAction: 'border-t border-white/[0.06] bg-white/[0.02]',
                footerActionText: 'text-white/40 text-xs',
                footerActionLink: 'text-[#29AAE2] hover:text-[#3DB8EE] font-semibold text-xs transition-colors',
                identityPreviewText: 'text-white/70',
                identityPreviewEditButton: 'text-[#29AAE2] hover:text-[#3DB8EE]',
                formFieldSuccessText: 'text-emerald-400',
                formFieldErrorText: 'text-red-400',
                alertText: 'text-white/70',
                otpCodeField: 'gap-2',
                otpCodeFieldInput: 'border border-white/[0.1] bg-white/[0.05] text-white rounded-xl',
              },
            }}
          />

          <p className="text-center text-xs text-white/20 mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#29AAE2] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
