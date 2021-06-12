import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@app/components/Layout'
import SimulationForm from '@app/components/SimulationForm'

function Home() {
  const { t } = useTranslation('common')
  return (
    <Layout>
      {t('intro', { siteName: 'hsfp.tokyo' })}
      <div className={`flex flex-col space-y-8`}>
        <SimulationForm />
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
