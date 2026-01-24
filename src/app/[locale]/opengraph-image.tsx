import { ImageResponse } from '@vercel/og'
import { OG_WIDTH, OG_HEIGHT, colors, getOGTranslator } from '@lib/og'

export const runtime = 'edge'
export const alt = 'HSFP.tokyo - Japan Visa Points Calculator'
export const size = { width: OG_WIDTH, height: OG_HEIGHT }
export const contentType = 'image/png'

interface Props {
  params: {
    locale: string
  }
}

export default async function Image({ params }: Props) {
  const t = await getOGTranslator(params.locale)

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
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: '72px',
          fontWeight: 700,
          marginBottom: '24px',
        }}
      >
        <span style={{ display: 'flex', color: '#ef4444' }}>HSFP</span>
        <span style={{ display: 'flex', color: 'rgba(255,255,255,0.4)' }}>
          .
        </span>
        <span style={{ display: 'flex', color: '#fafafa' }}>tokyo</span>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '32px',
          color: colors.muted,
          textAlign: 'center',
          maxWidth: '800px',
        }}
      >
        {t('default.description')}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '48px',
          marginTop: '48px',
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
              color: colors.accent,
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
            {t('stats.points_to_qualify')}
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
              color: colors.accent,
            }}
          >
            3
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              color: colors.muted,
            }}
          >
            {t('stats.visa_categories')}
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
              color: colors.accent,
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
            {t('stats.to_complete')}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
