import { ImageResponse } from '@vercel/og'
import {
  OG_WIDTH,
  OG_HEIGHT,
  colors,
  getOGTranslator,
  getVisaTypeLabel,
} from '@lib/og'

export const runtime = 'edge'
export const alt = 'HSFP Visa Calculator'
export const size = { width: OG_WIDTH, height: OG_HEIGHT }
export const contentType = 'image/png'

interface Props {
  params: {
    visa: string
    locale: string
  }
}

export default async function Image({ params }: Props) {
  const t = await getOGTranslator(params.locale)
  const visaLabel = await getVisaTypeLabel(params.locale, params.visa)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: '60px',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: colors.accent,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {visaLabel}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '72px',
            fontWeight: 700,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          {t('visa_intro.title', { visaType: '' }).trim()}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: 700,
                color: colors.text,
              }}
            >
              70
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                color: colors.muted,
              }}
            >
              {t('visa_intro.points_to_qualify')}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '48px',
                fontWeight: 700,
                color: colors.text,
              }}
            >
              5 min
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                color: colors.muted,
              }}
            >
              {t('visa_intro.to_complete')}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '40px',
          right: '60px',
          fontSize: '24px',
          fontWeight: 700,
        }}
      >
        <span style={{ display: 'flex', color: '#ef4444' }}>HSFP</span>
        <span style={{ display: 'flex', color: 'rgba(255,255,255,0.4)' }}>
          .
        </span>
        <span style={{ display: 'flex', color: '#fafafa' }}>tokyo</span>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
