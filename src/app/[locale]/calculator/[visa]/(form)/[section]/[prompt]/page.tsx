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
  params: Promise<{
    visa: string
    locale: string
    section: string
    prompt: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const p = await params
  const sp = await searchParams
  const t = await getOGTranslator(p.locale)
  const visaType = getVisaTypeFromSlug(p.visa)
  const visaLabel = await getVisaTypeLabel(p.locale, p.visa)
  const formConfig = formConfigForVisa(p.visa)

  let progressPercentage = 0
  let points = 0

  if (sp?.q && formConfig) {
    try {
      const qualifications = decodeQualifications(sp.q)
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

  const title = t('meta.progress.title', {
    progress: progressPercentage,
    visaType: visaLabel,
  })
  const description =
    points > 0
      ? t('meta.progress.description_with_points', {
          visaType: visaLabel,
          progress: progressPercentage,
          points,
        })
      : t('meta.progress.description', {
          visaType: visaLabel,
          progress: progressPercentage,
        })

  const ogImageUrl = `/${p.locale}/calculator/${p.visa}/${p.section}/${p.prompt}/opengraph-image?progress=${progressPercentage}&points=${points}`

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

export default async function Page({ params }: Props) {
  const { visa } = await params
  return <PromptClient visa={visa} />
}
