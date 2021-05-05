import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function Home() {
  const { t } = useTranslation('common')
  return <div>{t('intro', { siteName: 'hsfp.tokyo' })}</div>
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
})

export default Home
