import { VisaType } from '@lib/domain'
import {
  FormConfig,
  Prompt,
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
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'

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
  const isEnabled = maxActivePrompt < getOverallPromptIndex(config, name, 0)

  const Icon = icons[name]

  return (
    <>
      <li>
        <div
          className={cn('flex space-x-3 align-middle items-center', {
            'disabled opacity-60 pointer-events-none': isEnabled,
          })}
        >
          <Icon className="w-5 h-5" />
          <span className="font-bold text-lg"> {t('title')}</span>
        </div>
        <ul className="border-l-2 border-stone-700 ml-2 mt-2 flex flex-col space-y-1">
          {prompts.map((prompt, i) => (
            <Prompt
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
  prompt: Prompt
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
  const isEnabled = maxActivePrompt < overallPromptIndex

  return (
    <li
      key={prompt.id}
      className={cn('ml-4 rounded text-sm', {
        'bg-stone-700': isActive,
        'disabled opacity-60 pointer-events-none': isEnabled,
      })}
    >
      <Link
        href={urlForPrompt(config.visaType, name, promptIndex, qualifications)}
        className="no-underline flex justify-between items-center px-3 py-2"
      >
        {title}
        {isActive && !isCompleted ? (
          <div className="w-2 h-2 bg-stone-800 rounded" />
        ) : null}
        {isCompleted ? (
          <CheckIcon className="w-4 h-4 text-emerald-600" />
        ) : null}
      </Link>
    </li>
  )
}
