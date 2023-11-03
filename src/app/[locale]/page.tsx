import { Logo } from '@components/Logo'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'

export default function Page() {
  const t = useTranslations('index')

  return (
    <>
      <header className="py-6 px-4 flex justify-between space-x-8">
        <Logo />
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href={`/`}>{t('home')}</Link>
            </li>
            <li>
              <Link href={`/start`}> {t('calculator')}</Link>
            </li>
            <li>
              <Link href={`/about`}>{t('about')}</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div>
        <Link href={`/calculator/researcher`}>{t('start_researcher')}</Link>
        <br />
        <Link href={`/calculator/engineer`}>{t('start_engineer')}</Link>
        <br />
        <Link href={`/calculator/business-manager`}>
          {t('start_business_manager')}
        </Link>
      </div>
    </>
  )
}
