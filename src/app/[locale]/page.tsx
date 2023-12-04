import { Logo } from '@components/Logo'
import {
  BeakerIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'

export default function Page() {
  const t = useTranslations('index')

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <header className="py-6 px-4 flex justify-between space-x-8 border-b-4 border-zinc-900/50">
          <Logo />
          <nav>
            <ul className="flex space-x-4 items-center justify-center h-full font-semibold text-lg">
              <li>
                <Link
                  href={`/`}
                  className="no-underline border-b-2 border-emerald-400/80 hover:border-white/40"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href={`/about`} className="no-underline">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <section className="max-w-7xl px-4">
          <h1 className="mt-16 text-center text-5xl leading-normal font-bold tracking-tighter sm:text-6xl/normal md:text-7xl/normal">
            Japan Highly Skilled Foreign Professional Visa Points Calculator
          </h1>
          <p className="text-center my-8 text-zinc-400 text-xl/relaxed lg:text-2xl/relaxed xl:text-3xl/relaxed">
            Choose your visa category to start the points calculation.
          </p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 text-center">
            <Link
              className="card bg-zinc-900 hover:bg-zinc-900/80 transition ease-in-out duration-200 shadow-xl p-4 rounded-lg no-underline hover:ring-2 ring-emerald-400/80"
              href={`/calculator/researcher`}
            >
              <div className="card-body space-y-4">
                <h3 className="text-2xl font-semibold flex justify-center items-center space-x-2">
                  <BeakerIcon className="w-5 h-5" />
                  <span>Researcher</span>
                </h3>
                <p className="text-zinc-400">
                  Visa for academic research activities.
                </p>
                <div className="mt-10 rounded-md bg-zinc-600/50 py-2 px-4">
                  Start points calculation
                </div>
              </div>
            </Link>

            <Link
              className="card bg-zinc-900 hover:bg-zinc-900/80 transition ease-in-out duration-200 shadow-xl p-4 rounded-lg no-underline hover:ring-2 ring-emerald-400/80"
              href={`/calculator/engineer`}
            >
              <div className="card-body space-y-4">
                <h3 className="text-2xl font-semibold flex justify-center items-center space-x-2">
                  <WrenchScrewdriverIcon className="w-5 h-5" />
                  <span>Engineer</span>
                </h3>
                <p className="text-zinc-400">
                  Visa for various engineering roles.
                </p>
                <div className="mt-10 rounded-md bg-zinc-600/50 py-2 px-4">
                  Start points calculation
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
                  <span>Business Manager</span>
                </h3>
                <p className="text-zinc-400">
                  Visa for managerial positions in business.{' '}
                </p>
                <div className="mt-10 rounded-md bg-zinc-600/50 py-2 px-4">
                  Start points calculation
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
