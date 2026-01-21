import {
  BeakerIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  HomeIcon,
  UserGroupIcon,
  BoltIcon,
  CalculatorIcon,
  DocumentCheckIcon,
  ShareIcon,
  LightBulbIcon,
} from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'

export default function Page() {
  const t = useTranslations('home')

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="max-w-7xl px-4">
        <h1 className="mt-16 text-center text-5xl leading-normal font-bold tracking-tighter sm:text-6xl/normal md:text-7xl/normal">
          {t('title')}
        </h1>
        <p className="text-center my-8 text-zinc-400 text-xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed max-w-4xl mx-auto">
          {t('subtitle')}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 text-center mt-12">
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
            className="card bg-zinc-900 hover:bg-zinc-900/80 transition ease-in-out duration-200 shadow-xl p-4 rounded-lg no-underline hover:ring-2 ring-emerald-400/80"
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
            className="card bg-zinc-900 hover:bg-zinc-900/80 transition ease-in-out duration-200 shadow-xl p-4 rounded-lg no-underline hover:ring-2 ring-emerald-400/80"
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

      {/* Why HSFP Section */}
      <section className="max-w-7xl px-4 mt-16">
        <h2 className="text-3xl font-bold text-center mb-4">
          {t('why_hsfp.title')}
        </h2>
        <p className="text-center text-zinc-400 mb-12 max-w-3xl mx-auto">
          {t('why_hsfp.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <ClockIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold">
                {t('why_hsfp.benefits.pr_fast_track.title')}
              </h3>
            </div>
            <p className="text-zinc-400 text-sm">
              {t('why_hsfp.benefits.pr_fast_track.description')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <HomeIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold">
                {t('why_hsfp.benefits.five_year_visa.title')}
              </h3>
            </div>
            <p className="text-zinc-400 text-sm">
              {t('why_hsfp.benefits.five_year_visa.description')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <UserGroupIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold">
                {t('why_hsfp.benefits.family.title')}
              </h3>
            </div>
            <p className="text-zinc-400 text-sm">
              {t('why_hsfp.benefits.family.description')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <BoltIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold">
                {t('why_hsfp.benefits.priority_processing.title')}
              </h3>
            </div>
            <p className="text-zinc-400 text-sm">
              {t('why_hsfp.benefits.priority_processing.description')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <BriefcaseIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold">
                {t('why_hsfp.benefits.multiple_activities.title')}
              </h3>
            </div>
            <p className="text-zinc-400 text-sm">
              {t('why_hsfp.benefits.multiple_activities.description')}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <DocumentCheckIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-semibold">
                {t('why_hsfp.benefits.indefinite_stay.title')}
              </h3>
            </div>
            <p className="text-zinc-400 text-sm">
              {t('why_hsfp.benefits.indefinite_stay.description')}
            </p>
          </div>
        </div>
      </section>

      {/* How This App Helps Section */}
      <section className="max-w-7xl px-4 mt-20">
        <h2 className="text-3xl font-bold text-center mb-4">
          {t('how_app_helps.title')}
        </h2>
        <p className="text-center text-zinc-400 mb-12 max-w-3xl mx-auto">
          {t('how_app_helps.description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalculatorIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('how_app_helps.features.calculate.title')}
            </h3>
            <p className="text-zinc-400 text-sm">
              {t('how_app_helps.features.calculate.description')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LightBulbIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('how_app_helps.features.improve.title')}
            </h3>
            <p className="text-zinc-400 text-sm">
              {t('how_app_helps.features.improve.description')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentCheckIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('how_app_helps.features.evidence.title')}
            </h3>
            <p className="text-zinc-400 text-sm">
              {t('how_app_helps.features.evidence.description')}
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShareIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold mb-2">
              {t('how_app_helps.features.share.title')}
            </h3>
            <p className="text-zinc-400 text-sm">
              {t('how_app_helps.features.share.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Points Threshold Info */}
      <section className="max-w-7xl px-4 mt-20 mb-16">
        <div className="bg-gradient-to-r from-emerald-900/30 to-zinc-900 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{t('points_info.title')}</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div>
              <div className="text-5xl font-bold text-emerald-400">70</div>
              <p className="text-zinc-400 mt-2">{t('points_info.qualify')}</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-emerald-400">80+</div>
              <p className="text-zinc-400 mt-2">{t('points_info.pr_1_year')}</p>
            </div>
          </div>
          <p className="text-zinc-400 mt-6 max-w-2xl mx-auto text-sm">
            {t('points_info.description')}
          </p>
        </div>
      </section>
    </div>
  )
}
