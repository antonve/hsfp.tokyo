import { Metadata } from 'next'
import { formConfigForVisa } from '@lib/domain/form'
import { getVisaTypeLabel, getOGTranslator, OG_WIDTH, OG_HEIGHT } from '@lib/og'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import {
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Link } from '@lib/i18n/navigation'
import { getTranslations } from 'next-intl/server'

interface Props {
  params: Promise<{
    visa: string
    locale: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, visa } = await params
  const t = await getOGTranslator(locale)
  const visaLabel = await getVisaTypeLabel(locale, visa)

  const title = t('meta.visa_intro.title', { visaType: visaLabel })
  const description = t('meta.visa_intro.description', {
    visaType: visaLabel,
    points: HSFP_QUALIFICATION_THRESHOLD,
  })

  const ogImageUrl = `/${locale}/calculator/${visa}/opengraph-image`
  const ogImage = {
    url: ogImageUrl,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: t('alt.visa_calculator'),
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
  const { locale, visa } = await params
  const formConfig = formConfigForVisa(visa)
  if (!formConfig) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'visa_intro' })
  const tResults = await getTranslations({ locale, namespace: 'results' })

  const firstSection = formConfig.order[0]
  const startUrl = `/calculator/${visa}/${firstSection}/1`

  const visaTypeLabel = tResults(`visa_type.${visa}`)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Image */}
        <div className="hidden lg:flex lg:w-64 xl:w-72 flex-shrink-0 items-center">
          <Image
            src={`/images/calculator-intro-${visa}.jpg`}
            alt=""
            width={533}
            height={800}
            className="rounded-lg object-cover w-full"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('title', { visaType: visaTypeLabel })}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            {t('time_estimate')}
          </p>

          {/* Job Coverage */}
          <section className="mb-8 max-w-md">
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-3">
              {t('job_coverage.heading')}
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              {t(`job_coverage.${visa}`)}
            </p>
          </section>

          {/* Key Requirements */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-3">
              {t('requirements.heading')}
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {t('requirements.salary')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {t('requirements.points')}
                </span>
              </li>
            </ul>
          </section>

          {/* Tips */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-3">
              {t('tips.heading')}
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <LightBulbIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {t('tips.skip')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <DocumentTextIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {t('tips.results')}
                </span>
              </li>
            </ul>
          </section>

          {/* What You'll Need */}
          <section>
            <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-3">
              {t('prepare.heading')}
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {t('prepare.salary')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {t('prepare.education')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {t('prepare.experience')}
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-center mt-12">
        <Link
          href={startUrl}
          className="button large justify-center no-underline"
        >
          {t('start_button')}
          <ArrowRightIcon className="w-6 h-6" />
        </Link>
      </div>
    </div>
  )
}
