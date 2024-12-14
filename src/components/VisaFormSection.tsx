import {
  FormConfig,
  VisaProgress,
  getOverallPromptIndex,
  nextStepOfForm,
} from '@lib/domain/form'
import {
  Qualifications,
  encodeQualifications,
} from '@lib/domain/qualifications'
import { VisaFormPrompt } from '@components/VisaFormPrompt'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@lib/hooks'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import classNames from 'classnames'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

export type QualificationUpdater = (
  qualifications: Qualifications,
) => Qualifications

export function VisaFormSection({
  config,
  progress,
  qualifications,
}: {
  config: FormConfig
  progress: VisaProgress
  qualifications: Qualifications
}) {
  const router = useRouter()
  const params = useParams()
  const language = useLanguage()
  const t = useTranslations()
  const urlPrefix = `/${language}/calculator/${params['visa']}`

  const prompts = config.sections[progress.section]!!
  const prompt = prompts[progress.promptIndex]
  const overallPromptIndex = getOverallPromptIndex(
    config,
    progress.section,
    progress.promptIndex,
  )
  const translationPrefix = `visa_form.${config.visaType}.sections.${progress.section}.${prompt.id}`

  const submit = (updateQualifications: QualificationUpdater) => {
    const { section, promptIndex, finished } = nextStepOfForm(config, progress)
    const newQualifications = updateQualifications(qualifications)

    const nextPage = `${urlPrefix}/${
      finished ? `results` : `/${section}/${promptIndex + 1}`
    }?q=${encodeQualifications(newQualifications)}`

    router.push(nextPage)
  }

  return (
    <div className="flex flex-col min-h-full">
      <h2 className="font-semibold text-2xl mb-5">
        {t(`${translationPrefix}.prompt`)}
      </h2>
      <div className="flex-1 mb-10">
        <VisaFormPrompt
          qualifications={qualifications}
          prompt={prompt}
          onSubmit={submit}
          section={progress.section}
          visaType={config.visaType}
          overallPromptIndex={overallPromptIndex}
        />
        <FAQ
          count={prompt.faqCount ?? 0}
          translationPrefix={translationPrefix}
        />
      </div>
      <div className="">
        <button
          type="button"
          className="button outline w-full box-border justify-center"
          onClick={() => {
            const resultsUrl = `${urlPrefix}/results?q=${encodeQualifications(
              qualifications,
            )}`
            router.push(resultsUrl)
          }}
        >
          {t(`visa_form.actions.go_to_results`)}
        </button>
      </div>
    </div>
  )
}

// TODO: move
function FAQ({
  count,
  translationPrefix,
}: {
  count: number
  translationPrefix: string
}) {
  const t = useTranslations(translationPrefix)
  const [toggled, setToggled] = useState(0)

  if (count <= 0) {
    return null
  }

  function toggle(i: number) {
    const newToggled = toggled ^ (1 << i)
    console.log('new toggle value', newToggled)
    setToggled(newToggled)
  }

  function isToggled(i: number) {
    const mask = 1 << i
    return (toggled & mask) != 0
  }

  return (
    <div className="mt-10">
      <h2 className="font-semibold text-lg mb-4">Frequently Asked Questions</h2>
      <ol className="space-y-4">
        {Array.from(Array(count).keys()).map((_, i) => (
          <li key={i} className="rounded bg-zinc-900 px-4 py-2">
            <h3
              className="font-semibold cursor-pointer flex items-center justify-between"
              onClick={() => {
                console.log('toggling', i)
                toggle(i)
              }}
            >
              {t(`faq.q${i}`)}
              {isToggled(i) ? (
                <MinusIcon className="h-5 w-5 ml-2" />
              ) : (
                <PlusIcon className="h-5 w-5 ml-2" />
              )}
            </h3>
            <div
              className={classNames('text-sm mt-2', { hidden: !isToggled(i) })}
              dangerouslySetInnerHTML={{ __html: t.raw(`faq.a${i}`) }}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
