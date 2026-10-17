import { Metadata } from 'next'
import Image from 'next/image'
import { CSSProperties, Fragment, ReactNode } from 'react'
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
    'kicker mb-5 text-[22px] leading-[1.3] font-semibold tracking-[-0.015em] lg:text-[26px]'
  const mutedClass = 'text-zinc-500 dark:text-zinc-400'
  const isaLink = (chunks: ReactNode) => (
    <a
      href="https://www.moj.go.jp/isa/applications/resources/newimmiact_3_index.html"
      target="_blank"
      rel="noopener noreferrer"
      className="text-zinc-900 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-accent dark:text-gray-50"
    >
      {chunks}
    </a>
  )

  return (
    <main className="mx-auto max-w-7xl px-4 text-left leading-[1.6] antialiased">
      <section className="grid grid-cols-1 items-start gap-7 pt-8 pb-14 lg:grid-cols-2 lg:gap-[72px] lg:pt-[88px] lg:pb-24">
        <div>
          <h1 className="mb-3.5 text-[34px] leading-[1.08] font-[650] tracking-[-0.028em] text-balance [word-break:auto-phrase] lg:mb-6 lg:text-[56px] lg:leading-none lg:font-bold lg:tracking-[-0.04em] xl:text-[72px]">
            {t('title')}
          </h1>
          <p className="max-w-[34em] text-[17px] leading-[1.55] text-zinc-700 dark:text-zinc-300 lg:mb-6 lg:text-xl">
            {t.rich('intro', { isa: isaLink })}
          </p>
          <p
            className={`hidden max-w-[34em] text-[15px] lg:block ${mutedClass}`}
          >
            {t('meta')}
          </p>
        </div>
        <div>
          <h2 className="kicker mt-1.5 mb-3.5 text-xl leading-[1.6] font-semibold tracking-[-0.01em]">
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
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-[18px] py-4 no-underline hover:bg-zinc-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent dark:hover:bg-zinc-900 lg:px-[22px] lg:py-5"
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

      <section className="grid grid-cols-1 items-end gap-6 border-t border-zinc-200 pt-10 pb-14 lg:grid-cols-2 lg:gap-[72px] lg:pt-14 lg:pb-24 dark:border-zinc-800">
        <div>
          <h2 className="text-[28px] leading-[1.15] font-[650] tracking-[-0.025em] text-balance [word-break:auto-phrase] lg:max-w-[20ch] lg:text-4xl">
            {t('chart.title')}
          </h2>
          <p className={`mt-4 max-w-[34em] text-[15px] lg:mt-5 ${mutedClass}`}>
            {t('chart.note')}
          </p>
        </div>
        <dl className="grid grid-cols-[7.5em_minmax(0,1fr)] items-center gap-x-3 gap-y-4 lg:grid-cols-[9.5em_minmax(0,1fr)] lg:gap-x-[18px] lg:gap-y-[22px]">
          {routes.map(({ key, years }) => (
            <Fragment key={key}>
              <dt className="text-[15px] text-zinc-700 lg:text-base dark:text-zinc-300">
                {t(`chart.routes.${key}`)}
              </dt>
              <dd className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  // Leave room for the label so every bar shares one scale
                  className={`h-4 w-[calc((100%_-_6.5rem)_*_var(--f))] rounded-[5px] lg:h-[22px] lg:w-[calc((100%_-_8.5rem)_*_var(--f))] ${key === 'standard' ? 'bg-zinc-400 dark:bg-zinc-600' : 'bg-red-500'}`}
                  style={{ '--f': years / 10 } as CSSProperties}
                />
                <span className="text-[19px] font-bold tracking-[-0.02em] whitespace-nowrap tabular-nums lg:text-[26px]">
                  {t('chart.years', { count: years })}
                </span>
              </dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section className="grid grid-cols-1 gap-14 border-t border-zinc-200 pt-10 lg:grid-cols-2 lg:gap-[72px] lg:pt-14 dark:border-zinc-800">
        <div>
          <h2 className={headingClass}>{t('benefits.title')}</h2>
          <ul className="list-disc space-y-2 pl-[1.1em] text-zinc-700 marker:text-zinc-500 lg:text-[17px] dark:text-zinc-300 dark:marker:text-zinc-400">
            {['stay', 'spouse', 'family', 'side_work'].map(benefit => (
              <li key={benefit}>{t(`benefits.${benefit}`)}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={headingClass}>{t('caveats.title')}</h2>
          <div className="grid gap-5">
            {['employer', 'renewal', 'gaps'].map(caveat => (
              <p key={caveat} className={`text-[15px] ${mutedClass}`}>
                <strong className="mb-0.5 block text-base leading-[1.6] font-semibold text-zinc-900 lg:text-[17px] dark:text-gray-50">
                  {t(`caveats.${caveat}.title`)}
                </strong>
                {t(`caveats.${caveat}.description`)}
              </p>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-14 grid grid-cols-1 border-t-4 border-zinc-100/50 py-10 lg:mt-[72px] lg:grid-cols-2 lg:gap-[72px] lg:py-12 dark:border-zinc-900/50">
        <div className="flex items-start gap-4">
          <Image
            src="/images/anton.jpeg"
            alt=""
            width={48}
            height={48}
            className="size-12 flex-none rounded-full object-cover"
          />
          <div>
            <p className="mb-1.5 text-[15px] text-zinc-700 dark:text-zinc-300">
              {t.rich('author.note', { isa: isaLink })}
            </p>
            <div className="flex text-[15px]">
              <Link
                href="/about"
                className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-accent"
              >
                {t('author.link')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
