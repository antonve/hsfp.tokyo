import Link from 'next/link'
import { useTranslation } from '@lib/i18n'

interface Props {
  params: {
    locale: string
  }
}

export default async function Page({ params }: Props) {
  const { locale } = params
  const { t } = await useTranslation(locale, 'page')

  return (
    <>
      <header className="py-6 px-4 flex justify-between space-x-8">
        <h1 className="font-bold font-sans">
          <span className="text-red-500 text-2xl">HSFP</span>
          <span className="text-white/40">.</span>
          <span className="text-gray-50">tokyo</span>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href={`/${locale}/`}>{t('Home')}</Link>
            </li>
            <li>
              <Link href={`/${locale}/start`}> {t('Calculator')}</Link>
            </li>
            <li>
              <Link href={`/${locale}/about`}>{t('About')}</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div>
        <Link href={`/${locale}/calculator/researcher`}>{t('A')}</Link>
        <br />
        <Link href={`/${locale}/calculator/engineer`}>{t('B')}</Link>
        <br />
        <Link href={`/${locale}/calculator/business-manager`}>{t('C')}</Link>
      </div>
    </>
  )
}
