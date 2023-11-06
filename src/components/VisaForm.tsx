'use client'

import { FormConfig } from '@lib/domain/form'
import { useQualifications, useVisaFormProgress } from '@lib/hooks'
import { VisaFormSection } from '@components/VisaFormSection'
import { VisaFormNavigation } from './VisaFormNavigation'
import { Logo } from './Logo'
import { useTranslations } from 'next-intl'
import { VisaFormResultsPreview } from './VisaFormResultsPreview'

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const qualifications = useQualifications(config.visaType)
  const progress = useVisaFormProgress(config)
  const t = useTranslations('visa_form')

  return (
    <div className="flex flex-row min-h-screen">
      <aside className="sidebar w-72 shrink-0 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-stone-800">
        <div className="sidebar-header p-4">
          <Logo />
          <div className="font-semibold text-sm mt-4 -mx-2 px-2 py-2 rounded bg-stone-900/50">
            {t('form_title', { visaType: t(`visa_type.${config.visaType}`) })}
          </div>
        </div>
        <div className="sidebar-content px-2">
          <VisaFormNavigation
            config={config}
            progress={progress}
            qualifications={qualifications}
          />
        </div>
      </aside>
      <main className="p-8 flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
        <VisaFormSection
          config={config}
          progress={progress}
          qualifications={qualifications}
        />
        <VisaFormResultsPreview
          config={config}
          qualifications={qualifications}
        />
      </main>
    </div>
  )
}
