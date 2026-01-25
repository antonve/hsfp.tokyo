import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('title')}
        </h1>
      </section>

      {/* Author Section */}
      <section className="mb-16">
        <div className="bg-surface-secondary rounded-xl p-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Image
              src="/images/anton.jpeg"
              alt={t('author.name')}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{t('author.name')}</h2>
              <p className="text-content-muted mt-1">{t('author.role')}</p>
              <p className="mt-4 text-content-secondary">{t('author.bio')}</p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
                <a
                  href={`mailto:${t('author.email')}`}
                  className="text-emerald-400 hover:underline"
                >
                  {t('author.email')}
                </a>
                <a
                  href={`https://${t('author.website')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {t('author.website')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">{t('motivation.title')}</h2>
        <p className="text-content-secondary leading-relaxed">
          {t('motivation.content')}
        </p>
      </section>

      {/* Partnership Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">{t('partnership.title')}</h2>
        <p className="text-content-secondary leading-relaxed mb-4">
          {t('partnership.content')}
        </p>
        <p className="text-content-secondary">
          {t('partnership.cta')}{' '}
          <a
            href={`mailto:${t('author.email')}`}
            className="text-emerald-400 hover:underline"
          >
            {t('author.email')}
          </a>
        </p>
      </section>

      {/* Source & Disclaimer Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('source.title')}</h2>
        <p className="text-content-secondary mb-4">{t('source.isa_link')}</p>
        <a
          href="https://www.moj.go.jp/isa/publications/materials/newimmiact_3_index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-emerald-400 hover:underline mb-4"
        >
          {t('source.isa_link_text')} &rarr;
        </a>
        <p className="text-content-muted text-sm mb-6">
          {t('source.last_updated')}
        </p>
        <p className="text-content-muted text-sm mb-4">
          {t('source.disclaimer')}
        </p>
        <p className="text-content-muted text-sm">
          {t('source.contact')}{' '}
          <a
            href={`mailto:${t('author.email')}`}
            className="text-emerald-400 hover:underline"
          >
            {t('author.email')}
          </a>
        </p>
      </section>
    </div>
  )
}
