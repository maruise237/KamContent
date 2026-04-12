import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'KamContent — Arrête de réfléchir à quoi poster'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#07090F',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 350,
            background: 'radial-gradient(ellipse, rgba(41,170,226,0.18) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'rgba(41,170,226,0.12)',
            border: '1px solid rgba(41,170,226,0.25)',
            borderRadius: 100,
            padding: '6px 16px',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#4ade80',
            }}
          />
          <span style={{ color: '#29AAE2', fontSize: 15, fontWeight: 600 }}>
            Gratuit pendant la bêta
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            maxWidth: 900,
            marginBottom: 20,
          }}
        >
          Arrête de réfléchir à quoi poster.
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
            maxWidth: 680,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Idées & scripts IA pour créateurs TikTok, YouTube et Instagram.
          Planifie, publie, reste constant.
        </div>

        {/* Logo row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: '#29AAE2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            K
          </div>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            KamContent
          </span>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            color: 'rgba(255,255,255,0.2)',
            fontSize: 14,
          }}
        >
          kamcontent.app
        </div>
      </div>
    ),
    { ...size },
  )
}
