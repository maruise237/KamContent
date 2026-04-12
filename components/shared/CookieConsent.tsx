'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'

export function CookieConsent() {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('kc_cookie_consent')
    if (stored === 'accepted') setStatus('accepted')
    else if (stored === 'declined') setStatus('declined')
    else setStatus('pending')
  }, [])

  function accept() {
    localStorage.setItem('kc_cookie_consent', 'accepted')
    setStatus('accepted')
  }

  function decline() {
    localStorage.setItem('kc_cookie_consent', 'declined')
    setStatus('declined')
  }

  return (
    <>
      {/* Charge Umami uniquement si consentement donné */}
      {status === 'accepted' && (
        <Script
          id="umami-analytics"
          defer
          src="https://umami.kamtech.online/script.js"
          data-website-id="c84f2a3a-55f8-4ded-8c85-e073d299171a"
          strategy="afterInteractive"
        />
      )}

      {/* Bandeau */}
      <AnimatePresence>
        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="fixed bottom-4 left-4 right-4 z-[100] sm:left-auto sm:right-6 sm:max-w-sm"
          >
            <div className="bg-[#0C1018] border border-white/[0.1] rounded-2xl p-4 shadow-2xl shadow-black/60">
              {/* Top accent */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#29AAE2] to-transparent opacity-50 -mt-4 mb-4 rounded-t-2xl" />

              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Nous utilisons des cookies d&apos;analyse pour améliorer l&apos;expérience. Tes données restent anonymes et ne sont pas revendues.{' '}
                <Link href="/privacy" className="text-[#29AAE2] hover:underline">
                  En savoir plus
                </Link>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={accept}
                  className="flex-1 bg-[#29AAE2] hover:bg-[#3DB8EE] text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer"
                >
                  Accepter
                </button>
                <button
                  onClick={decline}
                  className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] text-white/60 hover:text-white/80 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer"
                >
                  Refuser
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
