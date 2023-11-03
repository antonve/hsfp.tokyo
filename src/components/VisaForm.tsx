'use client'

import { FormConfig } from '@lib/domain/form'
import { useQualifications, useVisaFormProgress } from '@lib/hooks'
import { VisaFormSection } from '@components/VisaFormSection'
import { VisaFormNavigation } from './VisaFormNavigation'
import { Logo } from './Logo'

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const qualifications = useQualifications(config.visaType)
  const progress = useVisaFormProgress(config)

  return (
    <div className="flex flex-row min-h-screen">
      <aside className="sidebar w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-stone-800">
        <div className="sidebar-header p-4">
          <Logo />
        </div>
        <div className="sidebar-content px-4">
          <VisaFormNavigation config={config} progress={progress} />
        </div>
      </aside>
      <main className="px-4 py-4">
        <VisaFormSection
          config={config}
          progress={progress}
          qualifications={qualifications}
        />
      </main>
    </div>
  )
}
