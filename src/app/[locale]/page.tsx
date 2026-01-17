import {
  BeakerIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'

export default function Page() {
  const t = useTranslations('home')

  return (
    <div className="max-w-7xl mx-auto">
      <section className="max-w-7xl px-4">
        <h1 className="mt-16 text-center text-5xl leading-normal font-bold tracking-tighter sm:text-6xl/normal md:text-7xl/normal">
          {t('title')}
        </h1>
        <p className="text-center my-8 text-zinc-400 text-xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed">
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 text-center">
          <Link
            className="card bg-zinc-900 hover:bg-zinc-900/80 transition ease-in-out duration-200 shadow-xl p-4 rounded-lg no-underline hover:ring-2 ring-emerald-400/80"
            href={`/calculator/engineer`}
          >
            <div className="card-body space-y-4">
              <h3 className="text-2xl font-semibold flex justify-center items-center space-x-2">
                <WrenchScrewdriverIcon className="w-5 h-5" />
                <span>{t('visa_cards.engineer.title')}</span>
              </h3>
              <p className="text-zinc-400">
                {t('visa_cards.engineer.description')}
              </p>
              <div className="mt-10 rounded-md bg-zinc-600/50 py-2 px-4">
                {t('visa_cards.engineer.cta')}
              </div>
            </div>
          </Link>

          <Link
            className="card bg-zinc-900 hover:bg-zinc-900/80 transition ease-in-out duration-200 shadow-xl p-4 rounded-lg no-underline hover:ring-2 ring-emerald-400/80 pointer-events-none opacity-30"
            aria-disabled="true"
            href={`/calculator/researcher`}
          >
            <div className="card-body space-y-4">
              <h3 className="text-2xl font-semibold flex justify-center items-center space-x-2">
                <BeakerIcon className="w-5 h-5" />
                <span>{t('visa_cards.researcher.title')}</span>
              </h3>
              <p className="text-zinc-400">
                {t('visa_cards.researcher.description')}
              </p>
              <div className="mt-10 rounded-md bg-zinc-600/50 py-2 px-4">
                {t('visa_cards.researcher.cta')}
              </div>
            </div>
          </Link>

          <Link
            className="card bg-zinc-900 hover:bg-zinc-900/80 transition ease-in-out duration-200 shadow-xl p-4 rounded-lg no-underline hover:ring-2 ring-emerald-400/80 pointer-events-none opacity-30"
            aria-disabled="true"
            href={`/calculator/business-manager`}
          >
            <div className="card-body space-y-4">
              <h3 className="text-2xl font-semibold flex justify-center items-center space-x-2">
                <BriefcaseIcon className="w-5 h-5" />
                <span>{t('visa_cards.business_manager.title')}</span>
              </h3>
              <p className="text-zinc-400">
                {t('visa_cards.business_manager.description')}
              </p>
              <div className="mt-10 rounded-md bg-zinc-600/50 py-2 px-4">
                {t('visa_cards.business_manager.cta')}
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
