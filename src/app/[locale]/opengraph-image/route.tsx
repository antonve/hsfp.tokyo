import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import {
  OG_WIDTH,
  OG_HEIGHT,
  colors,
  getOGTranslator,
  Logo,
  StatBlock,
} from '@lib/og'

export const runtime = 'edge'

export async function GET(
  _request: NextRequest,
  { params }: { params: { locale: string } },
) {
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
      <div style={{ display: 'flex', marginBottom: '24px' }}>
        <Logo size={72} />
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
        <StatBlock value={70} label={t('stats.points_to_qualify')} />
        <StatBlock value={3} label={t('stats.visa_categories')} />
        <StatBlock value="5 min" label={t('stats.to_complete')} />
      </div>
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
    },
  )
}
