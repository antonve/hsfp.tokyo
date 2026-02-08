import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import {
  OG_WIDTH,
  OG_HEIGHT,
  colors,
  getOGTranslator,
  getVisaTypeLabel,
  parseIntParam,
  Logo,
} from '@lib/og'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ visa: string; locale: string; section: string; prompt: string }>
  },
) {
  const searchParams = request.nextUrl.searchParams
  const { locale, visa } = await params
  const t = await getOGTranslator(locale)
  const visaLabel = await getVisaTypeLabel(locale, visa)

  const progressPercentage = parseIntParam(searchParams.get('progress'), 0, 100)
  const points = parseIntParam(searchParams.get('points'))

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
          fontSize: '24px',
          fontWeight: 600,
          color: colors.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '16px',
        }}
      >
        {t('progress.in_progress')}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '160px',
          fontWeight: 700,
          color: colors.text,
          lineHeight: 1,
        }}
      >
        {progressPercentage}%
      </div>

      <div
        style={{
          display: 'flex',
          width: '600px',
          height: '16px',
          backgroundColor: colors.progressBarBg,
          borderRadius: '8px',
          marginTop: '32px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: `${progressPercentage}%`,
            height: '100%',
            backgroundColor: colors.accent,
            borderRadius: '8px',
          }}
        />
      </div>

      <div
        style={{
          display: points > 0 ? 'flex' : 'none',
          alignItems: 'baseline',
          gap: '8px',
          marginTop: '32px',
        }}
      >
        <span
          style={{
            display: 'flex',
            fontSize: '48px',
            fontWeight: 700,
            color:
              points >= HSFP_QUALIFICATION_THRESHOLD
                ? colors.accent
                : colors.text,
          }}
        >
          {points}
        </span>
        <span
          style={{
            display: 'flex',
            fontSize: '24px',
            color: colors.muted,
          }}
        >
          {t('progress.points_so_far')}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '20px',
          color: colors.muted,
          marginTop: points > 0 ? '16px' : '40px',
        }}
      >
        {t('progress.visa_calculator', { visaType: visaLabel })}
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
