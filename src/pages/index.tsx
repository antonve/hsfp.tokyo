import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@app/components/Layout'
import VisaSelect from '@app/components/VisaSelect'
import AcademicBackground from '@app/components/AcademicBackground'

function Home() {
  const { t } = useTranslation('common')
  return (
    <Layout>
      {t('intro', { siteName: 'hsfp.tokyo' })}
      <div>
        <VisaSelect />
        <AcademicBackground />
      </div>
    </Layout>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'])),
  },
})

export default Home
