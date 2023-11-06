'use client'

import { FormConfig } from '@lib/domain/form'
import { useQualifications, useVisaFormProgress } from '@lib/hooks'
import { VisaFormSection } from '@components/VisaFormSection'
import { VisaFormNavigation } from './VisaFormNavigation'
import { VisaProgressBar } from './VisaProgressBar'
import { Logo } from './Logo'
import { useTranslations } from 'next-intl'
import { VisaFormResultsPreview } from './VisaFormResultsPreview'
import { useState } from 'react'
import cn from 'classnames'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const qualifications = useQualifications(config.visaType)
  const progress = useVisaFormProgress(config)
  const t = useTranslations('visa_form')
  const [sidebarActive, setSidebarActive] = useState(false)

  return (
    <div className="flex flex-row min-h-screen relative">
      <button
        onClick={() => setSidebarActive(true)}
        className="absolute left-2 top-2 bg-stone-800 p-2 rounded hover:opacity-60"
      >
        <Bars3BottomLeftIcon className="w-6 h-6" />
      </button>
      <aside
        className={cn(
          `sidebar w-72 shrink-0 transform md:shadow md:translate-x-0 transition-transform duration-150 ease-in bg-stone-800 z-50`,
          {
            '-translate-x-full': !sidebarActive,
            shadow: sidebarActive,
          },
        )}
      >
        <div className="sidebar-header p-4">
          <div className="flex justify-between">
            <Logo />
            <button
              onClick={() => setSidebarActive(false)}
              className={cn(`bg-stone-800 p-2 -mr-2 rounded md:hidden`, {
                hidden: !sidebarActive,
              })}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
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

      <main className="flex flex-col flex-grow -ml-72 mt-6 md:mt-0 md:ml-0 transition-all duration-150 ease-in">
        <VisaProgressBar config={config} qualifications={qualifications} />
        <div className="flex-grow h-full items-stretch p-8">
          <VisaFormSection
            config={config}
            progress={progress}
            qualifications={qualifications}
          />
        </div>
        <div className="flex-shrink">
          <VisaFormResultsPreview
            config={config}
            qualifications={qualifications}
          />
        </div>
      </main>
    </div>
  )
}
