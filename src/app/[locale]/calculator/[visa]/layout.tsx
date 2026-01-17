'use client'

import { formConfigForVisa } from '@lib/domain/form'
import { calculatePoints } from '@lib/domain/qualifications'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import { useQualifications, useVisaFormProgress } from '@lib/hooks'
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { notFound, usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import cn from 'classnames'
import { Logo } from '@components/Logo'
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
  const shouldRenderFormLayout = !pathname.endsWith('/results')

  const qualifications = useQualifications(formConfig.visaType)
  const progress = useVisaFormProgress(formConfig)
  const t = useTranslations('visa_form')
  const [sidebarActive, setSidebarActive] = useState(false)
  const { points } = useMemo(
    () => calculatePoints(qualifications),
    [qualifications],
  )
  const doesQualify = points >= HSFP_QUALIFICATION_THRESHOLD

  return (
    <div
      className={cn('flex flex-col relative', {
        'min-h-[calc(100dvh)]': shouldRenderFormLayout,
        'max-w-7xl mx-auto': !shouldRenderFormLayout,
      })}
    >
      {shouldRenderFormLayout ? (
        <div className="flex items-center px-4 py-4 border-b-4 border-zinc-900/50">
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
            className="no-underline hover:opacity-60 transition-opacity"
          >
            <Logo />
          </Link>
        </div>
      ) : null}
      <div className="flex flex-row flex-grow">
        {shouldRenderFormLayout ? (
          <aside
            className={cn(
              `sidebar w-72 shrink-0 transform md:shadow md:translate-x-0 transition-transform duration-150 ease-in bg-zinc-950 z-50 border-r-4 border-zinc-900/50`,
              {
                '-translate-x-full': !sidebarActive,
                shadow: sidebarActive,
              },
            )}
          >
            <div className="sidebar-header p-2">
              <div className="font-semibold text-sm px-2 py-2 rounded bg-zinc-900/50">
                {t('form_title', {
                  visaType: t(`visa_type.${formConfig.visaType}`),
                })}
              </div>
            </div>
            <div className="sidebar-content px-2">
              <VisaFormNavigation
                config={formConfig}
                progress={progress}
                qualifications={qualifications}
              />
            </div>
          </aside>
        ) : null}
        <main
          className={cn(
            'flex flex-col flex-grow transition-all duration-150 ease-in',
            {
              '-ml-72 md:ml-0': shouldRenderFormLayout,
            },
          )}
        >
          {shouldRenderFormLayout ? (
            <VisaProgressBar
              config={formConfig}
              qualifications={qualifications}
              doesQualify={doesQualify}
            />
          ) : null}
          <div
            className={cn('flex-grow h-full items-stretch ', {
              'p-4 md:p-8': shouldRenderFormLayout,
              'px-4 py-6': !shouldRenderFormLayout,
            })}
          >
            {children}
          </div>

          {shouldRenderFormLayout ? (
            <div className="flex-shrink">
              <VisaFormResultsPreview
                doesQualify={doesQualify}
                points={points}
              />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
