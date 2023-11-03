import { VisaType } from '@lib/domain'
import { FormConfig, SectionName, VisaProgress } from '@lib/domain/form'
import { useTranslations } from 'next-intl'
import Link from 'next-intl/link'
import { VisaProgressBar } from './VisaProgressBar'

export function VisaFormNavigation({
  config,
  progress,
}: {
  config: FormConfig
  progress: VisaProgress
}) {
  return (
    <div className='flex'>
      <VisaProgressBar
        progress={progress}
      />
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
    </div>

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
