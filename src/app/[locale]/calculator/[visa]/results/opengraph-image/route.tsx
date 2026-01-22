import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import {
  OG_WIDTH,
  OG_HEIGHT,
  colors,
  visaTypeLabels,
  getVisaTypeFromSlug,
} from '@lib/og'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: { visa: string; locale: string } },
) {
  const searchParams = request.nextUrl.searchParams
  const visaType = getVisaTypeFromSlug(params.visa)
  const visaLabel = visaType ? visaTypeLabels[visaType] : 'Visa'

  const points = parseInt(searchParams.get('points') || '0', 10)
  const isQualified = points >= HSFP_QUALIFICATION_THRESHOLD

  const pointsDiff = isQualified
    ? points - HSFP_QUALIFICATION_THRESHOLD
    : HSFP_QUALIFICATION_THRESHOLD - points

  const statusColor = isQualified ? colors.accent : colors.warning
  const statusText = isQualified ? 'QUALIFIED' : 'NOT QUALIFIED'
  const diffText = isQualified
    ? `${pointsDiff} points above threshold`
    : `${pointsDiff} points needed`

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
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: statusColor,
          }}
        />
        <div
          style={{
            display: 'flex',
            fontSize: '36px',
            fontWeight: 700,
            color: statusColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {statusText}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '180px',
          fontWeight: 700,
          color: colors.text,
          lineHeight: 1,
        }}
      >
        {points}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '32px',
          color: colors.muted,
          marginTop: '8px',
        }}
      >
        points
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '24px',
          color: statusColor,
          marginTop: '24px',
        }}
      >
        {diffText}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '20px',
          color: colors.muted,
          marginTop: '40px',
        }}
      >
        {visaLabel} Visa
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
      width: OG_WIDTH,
      height: OG_HEIGHT,
    },
  )
}
