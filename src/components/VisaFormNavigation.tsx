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
    <ul className="">
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
  // const isDone = getTotalPromptCount(config)
  const t = useTranslations(`visa_form.${config.visaType}.sections.${name}`)
  const prompts = config.sections[name]

  if (!prompts) {
    return undefined
  }

  const showPrompts = prompts.length >= 2
  const isSectionComplete = didCompleteSection(qualifications, config, name)

  const maxActivePrompt =
    getHighestCompletedOverallPromptIndex(qualifications) + 1

  return (
    <>
      <li
        className={cn({
          'bg-emerald-900': isSectionComplete,
          'disabled opacity-60 pointer-events-none':
            maxActivePrompt < getOverallPromptIndex(config, name, 0),
        })}
      >
        <Link href={urlForPrompt(config.visaType, name, 0, qualifications)}>
          {t('title')}
        </Link>
      </li>
      {showPrompts
        ? prompts.map((prompt, i) => (

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
          ))
        : undefined}
    </>
  )
}
