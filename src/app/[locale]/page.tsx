import { Metadata } from 'next'
import Image from 'next/image'
import { Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { getOGTranslator, OG_WIDTH, OG_HEIGHT } from '@lib/og'
import { Link } from '@lib/i18n/navigation'

interface Props {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getOGTranslator(locale)

  const title = t('default.title')
  const description = t('default.description')
  const ogImageUrl = `/${locale}/opengraph-image`

  const ogImage = {
    url: ogImageUrl,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    alt: t('alt.default'),
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

export default function Page() {
  const t = useTranslations('home')
  const options = ['engineer', 'researcher', 'business-manager'] as const
  const routes = [
    { key: 'standard', years: 10 },
    { key: '70', years: 3 },
    { key: '80', years: 1 },
  ] as const
  const headingClass =
    'mb-5 text-[22px] leading-[1.3] font-semibold tracking-[-0.015em]'
  const mutedClass = 'text-zinc-500 dark:text-zinc-400'

  return (
    <main className="mx-auto max-w-7xl px-4 text-left leading-[1.6] antialiased">
      <section className="grid grid-cols-1 items-start gap-7 pt-8 pb-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-[72px] lg:pt-20 lg:pb-10">
        <div>
          <h1 className="mb-3.5 text-[34px] leading-[1.08] font-[650] tracking-[-0.028em] lg:mb-5 lg:max-w-[12ch] lg:text-[46px]">
            {t('title')}
          </h1>
          <p className="max-w-[34em] text-[17px] leading-[1.55] text-zinc-700 dark:text-zinc-300 lg:mb-6 lg:text-[19px]">
            {t('intro')}
          </p>
          <p
            className={`hidden max-w-[34em] text-[15px] lg:block ${mutedClass}`}
          >
            {t('meta')}
          </p>
        </div>
        <div>
          <h2 className="mt-1.5 mb-3.5 text-xl leading-[1.6] font-semibold tracking-[-0.01em]">
            {t('question')}
          </h2>
          <ul className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            {options.map(visa => (
              <li
                key={visa}
                className="not-first:border-t border-zinc-200 dark:border-zinc-800"
              >
                <Link
                  href={`/calculator/${visa}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-[18px] py-4 no-underline hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-400 dark:hover:bg-zinc-900 lg:px-[22px] lg:py-5"
                >
                  <span>
                    <span className="block text-lg leading-[1.6] font-semibold tracking-[-0.01em]">
                      {t(`options.${visa}.title`)}
                    </span>
                    <span
                      className={`mt-0.5 block text-[15px] leading-[1.5] ${mutedClass}`}
                    >
                      {t(`options.${visa}.description`)}
                    </span>
                  </span>
                  <svg
                    className={`size-5 ${mutedClass}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
          <p
            className={`mt-3.5 max-w-[34em] text-[15px] lg:hidden ${mutedClass}`}
          >
            {t('meta')}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 pt-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-[72px] lg:pt-[72px]">
        <div>
          <h2 className={headingClass}>{t('chart.title')}</h2>
          <dl className="mb-[18px] grid grid-cols-[7.5em_minmax(0,1fr)] items-center gap-x-4 gap-y-3.5 lg:grid-cols-[9.5em_minmax(0,1fr)]">
            {routes.map(({ key, years }) => (
              <Fragment key={key}>
                <dt className="text-[15px] text-zinc-700 dark:text-zinc-300">
                  {t(`chart.routes.${key}`)}
                </dt>
                <dd className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-3.5 rounded-r ${key === 'standard' ? 'bg-zinc-400 dark:bg-zinc-600' : 'bg-emerald-600 dark:bg-emerald-400'}`}
                    style={{ width: `${(years / 10) * 84}%` }}
                  />
                  <span className="text-[15px] font-semibold whitespace-nowrap tabular-nums">
                    {t('chart.years', { count: years })}
                  </span>
                </dd>
              </Fragment>
            ))}
          </dl>
          <p className={`max-w-[38em] text-[15px] ${mutedClass}`}>
            {t('chart.note')}
          </p>
        </div>
        <div>
          <h2 className={headingClass}>{t('benefits.title')}</h2>
          <ul className="list-disc pl-[1.1em] text-zinc-700 marker:text-zinc-500 dark:text-zinc-300 dark:marker:text-zinc-400">
            {['stay', 'spouse', 'family', 'side_work'].map(benefit => (
              <li key={benefit} className="mb-2">
                {t(`benefits.${benefit}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pt-[72px]">
        <h2 className={headingClass}>{t('caveats.title')}</h2>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {['employer', 'renewal', 'gaps'].map(caveat => (
            <p key={caveat} className={`text-[15px] ${mutedClass}`}>
              <strong className="mb-1 block text-base leading-[1.6] font-semibold text-zinc-900 dark:text-gray-50">
                {t(`caveats.${caveat}.title`)}
              </strong>
              {t(`caveats.${caveat}.description`)}
            </p>
          ))}
        </div>
      </section>

      <div className="flex max-w-[46em] items-start gap-4 pt-14 pb-12 lg:pt-[72px] lg:pb-16">
        <Image
          src="/images/anton.jpeg"
          alt=""
          width={48}
          height={48}
          className="size-12 flex-none rounded-full object-cover"
        />
        <div>
          <p className="mb-1.5 text-[15px] text-zinc-700 dark:text-zinc-300">
            {t('author.note')}
          </p>
          <div className="flex text-[15px]">
            <Link
              href="/about"
              className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              {t('author.link')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
