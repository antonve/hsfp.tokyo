import { Metadata } from 'next'
import { formConfigForVisa } from '@lib/domain/form'
import { visaTypeLabels, getVisaTypeFromSlug } from '@lib/og'
import {
  ClockIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    visa: string
    locale: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const visaType = getVisaTypeFromSlug(params.visa)
  const visaLabel = visaType ? visaTypeLabels[visaType] : 'Visa'

  const title = `${visaLabel} Visa Calculator - HSFP.tokyo`
  const description = `Calculate if you qualify for Japan's Highly Skilled Foreign Professional (HSFP) ${visaLabel} visa. 70 points to qualify, takes about 5 minutes.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'HSFP.tokyo',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default function Page({ params }: Props) {
  const formConfig = formConfigForVisa(params.visa)
  if (!formConfig) {
    notFound()
  }

  const t = useTranslations('visa_intro')
  const tResults = useTranslations('results')

  const firstSection = formConfig.order[0]
  const startUrl = `/calculator/${params.visa}/${firstSection}/1`

  const visaTypeLabel = tResults(`visa_type.${params.visa}`)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Image */}
        <div className="hidden lg:flex lg:w-64 xl:w-72 flex-shrink-0 items-center">
          <Image
            src={`/images/calculator-intro-${params.visa}.jpg`}
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
          <p className="text-zinc-400 mb-8">{t('time_estimate')}</p>

          {/* Job Coverage */}
          <section className="mb-8 max-w-md">
            <h2 className="text-lg font-semibold text-zinc-300 uppercase tracking-wide mb-3">
              {t('job_coverage.heading')}
            </h2>
            <p className="text-zinc-300">{t(`job_coverage.${params.visa}`)}</p>
          </section>

          {/* Key Requirements */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-300 uppercase tracking-wide mb-3">
              {t('requirements.heading')}
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">
                  {t('requirements.salary')}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">
                  {t('requirements.points')}
                </span>
              </li>
            </ul>
          </section>

          {/* Tips */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-300 uppercase tracking-wide mb-3">
              {t('tips.heading')}
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <LightBulbIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{t('tips.skip')}</span>
              </li>
              <li className="flex items-start gap-3">
                <DocumentTextIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{t('tips.results')}</span>
              </li>
            </ul>
          </section>

          {/* What You'll Need */}
          <section>
            <h2 className="text-lg font-semibold text-zinc-300 uppercase tracking-wide mb-3">
              {t('prepare.heading')}
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{t('prepare.salary')}</span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{t('prepare.education')}</span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                <span className="text-zinc-300">{t('prepare.experience')}</span>
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
