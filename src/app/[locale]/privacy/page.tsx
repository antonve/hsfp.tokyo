import { useTranslations } from 'next-intl'

export default function PrivacyPage() {
  const t = useTranslations('privacy')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          {t('last_updated')}
        </p>
      </section>

      {/* Introduction */}
      <section className="mb-12">
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {t('intro')}
        </p>
      </section>

      {/* No Data Collection */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('no_collection.title')}</h2>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {t('no_collection.content')}
        </p>
      </section>

      {/* Local Storage */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('local_storage.title')}</h2>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
          {t('local_storage.content')}
        </p>
        <ul className="list-disc list-inside text-zinc-700 dark:text-zinc-300 space-y-2 ml-4">
          <li>{t('local_storage.items.calculator')}</li>
          <li>{t('local_storage.items.preferences')}</li>
        </ul>
      </section>

      {/* Your Control */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('control.title')}</h2>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {t('control.content')}
        </p>
      </section>

      {/* Third-Party Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('third_party.title')}</h2>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {t('third_party.content')}
        </p>
      </section>

      {/* Future Changes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t('changes.title')}</h2>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {t('changes.content')}
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t('contact.title')}</h2>
        <p className="text-zinc-700 dark:text-zinc-300">
          {t('contact.content')}{' '}
          <a
            href="mailto:contact@hsfp.tokyo"
            className="text-emerald-400 hover:underline"
          >
            contact@hsfp.tokyo
          </a>
        </p>
      </section>
    </div>
  )
}
