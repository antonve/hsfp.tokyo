import {
  FormConfig,
  VisaProgress,
  getOverallPromptIndex,
  nextStepOfForm,
  previousStepOfForm,
} from '@lib/domain/form'
import {
  Qualifications,
  encodeQualifications,
} from '@lib/domain/qualifications'
import { VisaFormPrompt } from '@components/VisaFormPrompt'
import { FrequentlyAskedQuestions } from '@components/FrequentlyAskedQuestions'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@lib/hooks'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import { withCompletedPrompt } from '@lib/domain/prompts'

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

  const formRef = useRef<HTMLDivElement>(null)

  const submit = (updateQualifications: QualificationUpdater) => {
    const { section, promptIndex, finished } = nextStepOfForm(config, progress)
    const newQualifications = updateQualifications(qualifications)

    const nextPage = `${urlPrefix}/${
      finished ? `results` : `/${section}/${promptIndex + 1}`
    }?q=${encodeQualifications(newQualifications)}`

    router.push(nextPage)
  }

  const goToPreviousQuestion = () => {
    const { section, promptIndex, isFirst } = previousStepOfForm(
      config,
      progress,
    )
    if (isFirst) return

    const prevPage = `${urlPrefix}/${section}/${promptIndex + 1}?q=${encodeQualifications(qualifications)}`
    router.push(prevPage)
  }

  const skipAndGoNext = () => {
    submit(q => ({
      ...withCompletedPrompt(overallPromptIndex, q),
    }))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field (for NumberPrompt)
      const target = e.target as HTMLElement
      const isTextInput =
        target.tagName === 'INPUT' &&
        (target as HTMLInputElement).type === 'text'

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPreviousQuestion()
      }

      if (e.key === 'ArrowRight' && !isTextInput) {
        e.preventDefault()
        skipAndGoNext()
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        const form = formRef.current?.querySelector('form')
        if (form) {
          form.requestSubmit()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div ref={formRef} className="flex flex-col min-h-full">
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
        <FrequentlyAskedQuestions
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
