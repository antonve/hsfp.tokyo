'use client'

import { formConfigForVisa } from '@lib/domain/form'
import { calculatePoints } from '@lib/domain/qualifications'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import { useQualifications, useVisaFormProgress } from '@lib/hooks'
import {
  Bars3BottomLeftIcon,
  XMarkIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid'
import { notFound, usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import cn from 'classnames'
import { Logo } from '@components/Logo'
import { SettingsModal } from '@components/SettingsModal'
import { VisaFormNavigation } from '@components/VisaFormNavigation'
import { VisaProgressBar } from '@components/VisaProgressBar'
import { VisaFormResultsPreview } from '@components/VisaFormResultsPreview'

interface Props {
  children: React.ReactNode
  params: {
    visa: string
  }
}

export default function Layout({ children, params }: Props) {
  const formConfig = formConfigForVisa(params.visa)
  if (!formConfig) {
    notFound()
  }

  const pathname = usePathname()
  const isResultsPage = pathname.endsWith('/results')
  const isOgImage = pathname.includes('opengraph-image')

  // OG image routes don't need the layout
  if (isOgImage) {
    return <>{children}</>
  }

  return (
    <VisaFormLayout
      formConfig={formConfig}
      isResultsPage={isResultsPage}
      isOgImage={isOgImage}
    >
      {children}
    </VisaFormLayout>
  )
}

function VisaFormLayout({
  children,
  formConfig,
  isResultsPage,
  isOgImage,
}: {
  children: React.ReactNode
  formConfig: ReturnType<typeof formConfigForVisa>
  isResultsPage: boolean
  isOgImage: boolean
}) {
  // formConfigForVisa() is guarded by notFound() in the parent.
  const qualifications = useQualifications(formConfig!.visaType)
  const progress = useVisaFormProgress(formConfig!, isOgImage)

  const t = useTranslations('visa_form')
  const [sidebarActive, setSidebarActive] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const { points } = useMemo(() => {
    try {
      return calculatePoints(qualifications)
    } catch {
      return { points: 0, matches: [] }
    }
  }, [qualifications])
  const doesQualify = points >= HSFP_QUALIFICATION_THRESHOLD

  if (isResultsPage) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-6">{children}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col relative min-h-[calc(100dvh)]">
      <div className="flex items-center px-4 py-4 border-b-4 border-zinc-100/50 dark:border-zinc-900/50">
        <button
          onClick={() => setSidebarActive(!sidebarActive)}
          className={cn(`p-2 mr-2 rounded md:hidden`, {})}
        >
          {sidebarActive ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3BottomLeftIcon className="w-6 h-6" />
          )}
        </button>
        <Link
          href={`/`}
          className="no-underline hover:opacity-60 transition-opacity flex-grow"
        >
          <Logo />
        </Link>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-gray-50 transition-colors"
          aria-label="Settings"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <div className="flex flex-row flex-grow">
        <aside
          className={cn(
            `sidebar w-72 shrink-0 transform md:translate-x-0 transition-transform duration-150 ease-in bg-white dark:bg-zinc-950 z-50 border-r-4 border-zinc-100/50 dark:border-zinc-900/50`,
            {
              '-translate-x-full': !sidebarActive,
              shadow: sidebarActive,
            },
          )}
        >
          <div className="sidebar-header p-2">
            <div className="font-semibold text-sm px-2 py-2 rounded bg-zinc-100 dark:bg-zinc-900">
              {t('form_title', {
                visaType: t(`visa_type.${formConfig!.visaType}`),
              })}
            </div>
          </div>
          <div className="sidebar-content px-2">
            <VisaFormNavigation
              config={formConfig!}
              progress={progress}
              qualifications={qualifications}
            />
          </div>
        </aside>
        <main className="flex flex-col flex-grow transition-all duration-150 ease-in -ml-72 md:ml-0">
          <VisaProgressBar
            config={formConfig!}
            qualifications={qualifications}
            doesQualify={doesQualify}
          />
          <div className="flex-grow h-full items-stretch p-4 md:p-8 bg-zinc-100 dark:bg-zinc-900">
            {children}
          </div>
          <div className="flex-shrink">
            <VisaFormResultsPreview doesQualify={doesQualify} points={points} />
          </div>
        </main>
      </div>
    </div>
  )
}
