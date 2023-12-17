import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations('results')

  return (
    <>
      <div className="max-w-7xl mx-auto">todo: results page</div>
    </>
  )
}
