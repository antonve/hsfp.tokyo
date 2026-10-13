import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('about')
  const linkClass =
    'text-zinc-900 dark:text-gray-50 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-accent'
  const paragraphClass = 'mb-3.5 text-[17px] text-zinc-700 dark:text-zinc-300'
  const headingClass =
    'mt-11 mb-3 text-[22px] leading-[1.3] font-semibold tracking-[-0.015em]'

  return (
    <main className="mx-auto max-w-7xl px-4 text-left leading-[1.6] antialiased">
      <div className="max-w-[40em] pt-10 pb-14 md:pt-[72px] md:pb-[88px]">
        <h1 className="mb-2 text-[32px] leading-[1.08] font-[650] tracking-[-0.028em] md:text-[40px]">
          {t('title')}
        </h1>
        <h2 className={headingClass}>{t('source.title')}</h2>
        <p className={paragraphClass}>
          {t.rich('source.content', {
            isa: chunks => (
              <a
                href="https://www.moj.go.jp/isa/publications/materials/newimmiact_3_index.html"
                className={linkClass}
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className={paragraphClass}>{t('source.disclaimer')}</p>
        <h2 className={headingClass}>{t('contact.title')}</h2>
        <p className={paragraphClass}>
          {t.rich('contact.corrections', {
            email: chunks => (
              <a href="mailto:contact@hsfp.tokyo" className={linkClass}>
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className={paragraphClass}>{t('contact.professionals')}</p>
        <p className={paragraphClass}>
          {t.rich('contact.author', {
            website: chunks => (
              <a href="https://antonve.be" className={linkClass}>
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </main>
  )
}
