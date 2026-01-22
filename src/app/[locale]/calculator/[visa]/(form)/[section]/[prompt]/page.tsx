import { Metadata } from 'next'
import {
  decodeQualifications,
  calculatePoints,
  QualificationsSchema,
  generateSessionId,
} from '@lib/domain/qualifications'
import { formConfigForVisa, getFormProgress } from '@lib/domain/form'
import { visaTypeLabels, getVisaTypeFromSlug } from '@lib/og'
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
  const visaType = getVisaTypeFromSlug(params.visa)
  const visaLabel = visaType ? visaTypeLabels[visaType] : 'Visa'
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
  return <PromptClient visa={params.visa} />
}
