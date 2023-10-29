import Link from 'next/link'
import { fallbackLanguage, supportedLanguages, useTranslation } from '@lib/i18n'

interface Props {
  params: {
    language: string
  }
}

export default async function Page({ params }: Props) {
  let language = params?.language
  if (supportedLanguages.indexOf(language) < 0) language = fallbackLanguage
  const { t } = await useTranslation(language, 'page')
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
              <Link href={`/${language}/`}>{t('Home')}</Link>
            </li>
            <li>
              <Link href={`/${language}/start`}> {t('Calculator')}</Link>
            </li>
            <li>
              <Link href={`/${language}/about`}>{t('About')}</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div>
        <Link href={`/${language}/calculator/researcher`}>{t('A')}</Link>
        <br />
        <Link href={`/${language}/calculator/engineer`}>{t('B')}</Link>
        <br />
        <Link href={`/${language}/calculator/business-manager`}>{t('C')}</Link>
      </div>
    </>
  )
}
