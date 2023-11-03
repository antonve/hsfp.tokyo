import { VisaType } from '@lib/domain'
import { FormConfig, SectionName, VisaProgress } from '@lib/domain/form'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'

export function VisaFormNavigation({
  config,
  progress,
}: {
  config: FormConfig
  progress: VisaProgress
}) {
  return (
    <ul className="">
      {config.order.map(section => (
        <Section
          name={section}
          progress={progress}
          key={section}
          config={config}
        />
      ))}
    </ul>
  )
}

function getTotalPromptCount(config: FormConfig) {
  return config.order.flatMap(sectionName => config.sections[sectionName] ?? [])
    .length
}

function getCurrentPromptIndex(config: FormConfig, progress: VisaProgress) {
  const sectionIndex = config.order.indexOf(progress.section)
  const prevSectionsPromptCount = config.order
    .filter((_, i) => i < sectionIndex)
    .flatMap(sectionName => config.sections[sectionName] ?? []).length

  return prevSectionsPromptCount + progress.promptIndex
}

function urlForPrompt(
  visaType: VisaType,
  sectionName: SectionName,
  promptIndex: number,
) {
  return `/calculator/${visaType}/${sectionName}/${promptIndex + 1}`
}

function Section({
  name,
  config,
  progress,
}: {
  name: SectionName
  config: FormConfig
  progress: VisaProgress
}) {
  // const isDone = getTotalPromptCount(config)
  const t = useTranslations(`visa_form.${config.visaType}.sections.${name}`)
  const prompts = config.sections[name]

  if (!prompts) {
    return undefined
  }

  const showPrompts = prompts.length >= 2

  return (
    <>
      <li className="">
        <Link href={urlForPrompt(config.visaType, name, 0)}>{t('title')}</Link>
      </li>
      {showPrompts
        ? prompts.map(prompt => (
            <li key={prompt.id} className="ml-4">
              {t(`${prompt.id}.title`)}
            </li>
          ))
        : undefined}
    </>
  )
}
