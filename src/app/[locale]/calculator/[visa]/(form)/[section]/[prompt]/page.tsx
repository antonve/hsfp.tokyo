import { Metadata } from 'next'
import {
  decodeQualifications,
  calculatePoints,
  QualificationsSchema,
  generateSessionId,
} from '@lib/domain/qualifications'
import { formConfigForVisa, getFormProgress } from '@lib/domain/form'
import {
  getVisaTypeLabel,
  getVisaTypeFromSlug,
  getOGTranslator,
  OG_WIDTH,
  OG_HEIGHT,
} from '@lib/og'
import PromptClient from './PromptClient'

interface Props {
  params: {
    visa: string
    locale: string
    section: string
    prompt: string
  }
  searchParams: {
    q?: string
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const t = await getOGTranslator(params.locale)
  const visaType = getVisaTypeFromSlug(params.visa)
  const visaLabel = await getVisaTypeLabel(params.locale, params.visa)
  const formConfig = formConfigForVisa(params.visa)

  let progressPercentage = 0
  let points = 0

  if (searchParams?.q && formConfig) {
    try {
      const qualifications = decodeQualifications(searchParams.q)
      progressPercentage = Math.ceil(
        getFormProgress(formConfig, qualifications),
      )
      const result = calculatePoints(qualifications)
      points = result.points
    } catch {
      // If decoding fails, show 0 progress
    }
  } else if (formConfig && visaType) {
    const defaultQualifications = QualificationsSchema.parse({
      v: visaType,
      completed: 0,
      s: generateSessionId(),
    })
    progressPercentage = Math.ceil(
      getFormProgress(formConfig, defaultQualifications),
    )
  }

  const title = `${progressPercentage}% Complete - ${visaLabel} Visa Calculator`
  const description =
    points > 0
      ? `${visaLabel} HSFP visa calculator - ${progressPercentage}% complete with ${points} points so far.`
      : `${visaLabel} HSFP visa calculator - ${progressPercentage}% complete. Calculate if you qualify for Japan's Highly Skilled Professional visa.`

  const ogImageUrl = `/${params.locale}/calculator/${params.visa}/${params.section}/${params.prompt}/opengraph-image?progress=${progressPercentage}&points=${points}`

  const ogImage = {
    url: ogImageUrl,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: t('alt.progress', {
      visaType: visaLabel,
      progress: progressPercentage,
    }),
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

export default function Page({ params }: Props) {
  return <PromptClient visa={params.visa} />
}
