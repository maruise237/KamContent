export const dynamic = 'force-dynamic'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { CheckCircle2, Zap, Calendar, TrendingUp } from 'lucide-react'

const benefits = [
  { icon: Zap, text: 'Idées et scripts IA en quelques secondes' },
  { icon: Calendar, text: 'Calendrier éditorial automatisé' },
  { icon: TrendingUp, text: 'Suivi de ta constance de publication' },
]

export default function LoginPage() {
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#29AAE2]/[0.07] rounded-full blur-[100px] pointer-events-none" />

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
              <span className="text-xs font-semibold text-[#29AAE2]">Gratuit pendant la bêta</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white leading-tight tracking-tight text-balance mb-4">
              Arrête de bloquer sur quoi poster.
            </h2>
            <p className="text-white/50 text-[15px] leading-relaxed max-w-sm">
              KamContent génère tes idées et scripts IA, planifie ton calendrier et suit ta régularité — pour que tu restes focus sur ta croissance.
            </p>
          </div>

          <ul className="space-y-3">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#29AAE2]/10 border border-[#29AAE2]/20 shrink-0">
                  <Icon className="h-3.5 w-3.5 text-[#29AAE2]" />
                </div>
                <span className="text-white/65 text-sm">{text}</span>
              </li>
            ))}
          </ul>

          {/* Testimonial */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5">
            <p className="text-white/65 text-sm leading-relaxed mb-4">
              &ldquo;Avant KamContent je passais 2h à chercher des idées chaque semaine. Maintenant j&apos;ai mon script en 3 minutes et je publie 5× par semaine sans stress.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#29AAE2]/25 border border-[#29AAE2]/30 flex items-center justify-center text-[11px] font-bold text-[#29AAE2]">AK</div>
              <div>
                <p className="text-white/80 text-xs font-semibold">Axel K.</p>
                <p className="text-white/35 text-xs">Créateur TikTok · 47k abonnés</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-3 w-3 fill-[#29AAE2]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex items-center gap-8">
          {[
            { value: '500+', label: 'Créateurs actifs' },
            { value: '12k+', label: 'Scripts générés' },
            { value: '4.9/5', label: 'Note bêta' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-display text-xl font-bold text-white">{value}</p>
              <p className="text-white/35 text-xs">{label}</p>
            </div>
          ))}
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
              Bon retour 👋
            </h1>
            <p className="text-white/45 text-sm">
              Connecte-toi pour retrouver tes idées et scripts.
            </p>
          </div>

          <SignIn
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
                loaderImage: 'text-[#29AAE2]',
                otpCodeField: 'gap-2',
                otpCodeFieldInput: 'border border-white/[0.1] bg-white/[0.05] text-white rounded-xl',
              },
            }}
          />

          <p className="text-center text-xs text-white/20 mt-6">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-[#29AAE2] hover:underline">
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
