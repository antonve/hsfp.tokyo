import { VisaType } from '@lib/domain'
import {
  FormConfig,
  Prompt as PromptType,
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
  isPromptCompleted,
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
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

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
    <ul>
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
  const [isExpandedManually, setIsExpandedManually] = useState(false)
  const isActive = progress.section === name
  const isExpanded = isExpandedManually || isActive

  const t = useTranslations(`visa_form.${config.visaType}.sections.${name}`)
  const prompts = config.sections[name]

  if (!prompts) {
    return undefined
  }

  const isSectionComplete = didCompleteSection(qualifications, config, name)

  const maxActivePrompt =
    getHighestCompletedOverallPromptIndex(qualifications) + 1

  const Icon = icons[name]
  const ToggleIcon = isExpanded ? BarsArrowUpIcon : BarsArrowDownIcon

  return (
    <>
      <li
        className={cn('px-2 py-2', {
          'bg-zinc-900/50 rounded': isActive,
        })}
      >
        <a
          className={cn(
            'flex space-x-3 align-middle items-center no-underline pr-3',
            {
              'pointer-events-none': isActive,
            },
          )}
          href="#"
          onClick={() => setIsExpandedManually(!isExpandedManually)}
        >
          <Icon className="w-5 h-5" />
          <span className="font-semibold text-lg flex-grow"> {t('title')}</span>

          {!isActive ? <ToggleIcon className="w-4 h-4 opacity-50" /> : null}
        </a>
        {isExpanded ? (
          <ul className="ml-2 mt-2">
            {prompts.map((prompt, i) => (
              <Prompt
                key={i}
                title={t(`${prompt.id}.title`)}
                prompt={prompt}
                promptIndex={i}
                maxActivePrompt={maxActivePrompt}
                name={name}
                config={config}
                qualifications={qualifications}
                progress={progress}
              />
            ))}
          </ul>
        ) : null}
      </li>
    </>
  )
}

function Prompt({
  title,
  prompt,
  config,
  promptIndex,
  name,
  maxActivePrompt,
  progress,
  qualifications,
}: {
  title: string
  prompt: PromptType
  promptIndex: number
  maxActivePrompt: number
  name: SectionName
  config: FormConfig
  progress: VisaProgress
  qualifications: Qualifications
}) {
  const overallPromptIndex = getOverallPromptIndex(config, name, promptIndex)
  const isCompleted = isPromptCompleted(overallPromptIndex, qualifications)
  const isActive =
    progress.promptIndex === promptIndex && progress.section === name
  const isEnabled = maxActivePrompt >= overallPromptIndex

  return (
    <li
      key={prompt.id}
      className={cn('text-sm border-l-2', {
        'border-zinc-100': isActive,
        'border-zinc-700': !isActive,
        'disabled opacity-60 cursor-not-allowed': !isEnabled,
      })}
    >
      <Link
        href={urlForPrompt(config.visaType, name, promptIndex, qualifications)}
        className={cn(
          'no-underline pr-3 pl-6 py-2  flex items-center justify-between',
          {
            'pointer-events-none': !isEnabled,
          },
        )}
      >
        {title}
        {isCompleted ? (
          <CheckIcon className="w-4 h-4 text-emerald-600" />
        ) : null}
      </Link>
    </li>
  )
}
