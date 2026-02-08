import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import {
  OG_WIDTH,
  OG_HEIGHT,
  colors,
  getOGTranslator,
  getVisaTypeLabel,
  Logo,
  StatBlock,
} from '@lib/og'

export const runtime = 'edge'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ visa: string; locale: string }> },
) {
  const { locale, visa } = await params
  const t = await getOGTranslator(locale)
  const visaLabel = await getVisaTypeLabel(locale, visa)

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
          {t('visa_intro.title_short')}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '24px',
          }}
        >
          <StatBlock
            value={70}
            label={t('stats.points_to_qualify')}
            valueColor={colors.text}
          />
          <StatBlock
            value="5 min"
            label={t('stats.to_complete')}
            valueColor={colors.text}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '40px',
          right: '60px',
        }}
      >
        <Logo size={24} />
      </div>
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    },
  )
}
