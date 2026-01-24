import { Metadata } from 'next'
import {
  decodeQualifications,
  calculatePoints,
} from '@lib/domain/qualifications'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import { getVisaTypeLabel } from '@lib/og'
import ResultsClient from './ResultsClient'

interface Props {
  params: {
    visa: string
    locale: string
  }
  searchParams: {
    q?: string
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const visaLabel = await getVisaTypeLabel(params.locale, params.visa)

  let points = 0
  let isQualified = false

  if (searchParams?.q) {
    try {
      const qualifications = decodeQualifications(searchParams.q)
      const result = calculatePoints(qualifications)
      points = result.points
      isQualified = points >= HSFP_QUALIFICATION_THRESHOLD
    } catch {
      // If decoding fails, show 0 points
    }
  }

  const title = isQualified
    ? `Qualified with ${points} points - ${visaLabel} Visa`
    : `${points} points - ${HSFP_QUALIFICATION_THRESHOLD - points} more needed`

  const description = isQualified
    ? `You qualify for the ${visaLabel} HSFP visa with ${points} points (${points - HSFP_QUALIFICATION_THRESHOLD} above the threshold).`
    : `You have ${points} points toward the ${visaLabel} HSFP visa. ${HSFP_QUALIFICATION_THRESHOLD - points} more points needed to qualify.`

  const ogImageUrl = `/${params.locale}/calculator/${params.visa}/results/opengraph-image?points=${points}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'HSFP.tokyo',
      images: [ogImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageUrl],
    },
  }
}

export default function Page({ params }: Props) {
  return <ResultsClient visa={params.visa} />
}
