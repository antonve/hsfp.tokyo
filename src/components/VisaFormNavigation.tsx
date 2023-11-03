import { VisaType } from '@lib/domain'
import { FormConfig, SectionName, VisaProgress } from '@lib/domain/form'
import { Qualifications } from '@lib/visa'
import { didCompleteSection } from '@lib/visa/prompts'
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
) {
  return `/calculator/${visaType}/${sectionName}/${promptIndex + 1}`
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

  return (
    <>
      <li className={`${isSectionComplete ? `bg-emerald-200` : ``}`}>
        <Link href={urlForPrompt(config.visaType, name, 0)}>{t('title')}</Link>
      </li>
      {showPrompts
        ? prompts.map((prompt, i) => (
            <li key={prompt.id} className="ml-4">
              <Link href={urlForPrompt(config.visaType, name, i)}>
                {t(`${prompt.id}.title`)}
              </Link>
            </li>
          ))
        : undefined}
    </>
  )
}
