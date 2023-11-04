import { VisaType } from '@lib/domain'
import {
  FormConfig,
  SectionName,
  VisaProgress,
  getOverallPromptIndex,
} from '@lib/domain/form'
import {
  Qualifications,
  encodeQualifications,
} from '@lib/domain/qualifications'
import {
  didCompleteSection,
  getHighestCompletedOverallPromptIndex,
} from '@lib/domain/prompts'
import cn from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import {
  AcademicCapIcon,
  BeakerIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  TagIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { SVGProps } from 'react'

export function VisaFormNavigation({
  config,
  progress,
  qualifications,
}: {
  config: FormConfig
  progress: VisaProgress
  qualifications: Qualifications
}) {
  return (
    <ul className="space-y-4">
      {config.order.map(section => (
        <Section
          name={section}
          progress={progress}
          key={section}
          config={config}
          qualifications={qualifications}
        />
      ))}
    </ul>
  )
}

function urlForPrompt(
  visaType: VisaType,
  sectionName: SectionName,
  promptIndex: number,
  q: Qualifications,
) {
  return `/calculator/${visaType}/${sectionName}/${
    promptIndex + 1
  }?q=${encodeQualifications(q)}`
}

const icons = {
  education: AcademicCapIcon,
  job: BriefcaseIcon,
  research: BeakerIcon, //DocumentMagnifyingGlassIcon
  employer: BuildingOfficeIcon,
  university: BookOpenIcon, //BuildingLibraryIcon
  bonus: TagIcon,
  position: UserIcon,
}

function Section({
  name,
  config,
  progress,
  qualifications,
}: {
  name: SectionName
  config: FormConfig
  progress: VisaProgress
  qualifications: Qualifications
}) {
  const t = useTranslations(`visa_form.${config.visaType}.sections.${name}`)
  const prompts = config.sections[name]

  if (!prompts) {
    return undefined
  }

  const isSectionComplete = didCompleteSection(qualifications, config, name)
  const maxActivePrompt =
    getHighestCompletedOverallPromptIndex(qualifications) + 1

  const Icon = icons[name]

  return (
    <>
      <li>
        <div
          className={cn('flex space-x-2', {
            'bg-emerald-900': isSectionComplete,
            'disabled opacity-60 pointer-events-none':
              maxActivePrompt < getOverallPromptIndex(config, name, 0),
          })}
        >
          <Icon className="w-5 h-5" />
          <span className="font-bold"> {t('title')}</span>
        </div>
        <ul>
          {prompts.map((prompt, i) => (
            <li
              key={prompt.id}
              className={cn('ml-4', {
                'bg-emerald-900': isSectionComplete,
                'disabled opacity-60 pointer-events-none':
                  maxActivePrompt < getOverallPromptIndex(config, name, i),
              })}
            >
              <Link
                href={urlForPrompt(config.visaType, name, i, qualifications)}
              >
                {t(`${prompt.id}.title`)}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    </>
  )
}
