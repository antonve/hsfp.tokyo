import { Metadata } from 'next'
import {
  decodeQualifications,
  calculatePoints,
} from '@lib/domain/qualifications'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import { getVisaTypeLabel, getOGTranslator, OG_WIDTH, OG_HEIGHT } from '@lib/og'
import ResultsClient from './ResultsClient'

interface Props {
  params: Promise<{
    visa: string
    locale: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale, visa } = await params
  const sp = await searchParams
  const t = await getOGTranslator(locale)
  const visaLabel = await getVisaTypeLabel(locale, visa)

  let points = 0
  let isQualified = false

  if (sp?.q) {
    try {
      const qualifications = decodeQualifications(sp.q)
      const result = calculatePoints(qualifications)
      points = result.points
      isQualified = points >= HSFP_QUALIFICATION_THRESHOLD
    } catch {
      // If decoding fails, show 0 points
    }
  }

  const pointsNeeded = HSFP_QUALIFICATION_THRESHOLD - points
  const pointsAbove = points - HSFP_QUALIFICATION_THRESHOLD

  const title = isQualified
    ? t('meta.results.qualified_title', { points, visaType: visaLabel })
    : t('meta.results.not_qualified_title', { points, needed: pointsNeeded })

  const description = isQualified
    ? t('meta.results.qualified_description', {
        points,
        visaType: visaLabel,
        above: pointsAbove,
      })
    : t('meta.results.not_qualified_description', {
        points,
        visaType: visaLabel,
        needed: pointsNeeded,
      })

  const ogImageUrl = `/${locale}/calculator/${visa}/results/opengraph-image?points=${points}`

  const ogImage = {
    url: ogImageUrl,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: t('alt.results', { visaType: visaLabel, points }),
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'HSFP.tokyo',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImage],
    },
  }
}

export default async function Page({ params }: Props) {
  const { visa } = await params
  return <ResultsClient visa={visa} />
}
