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
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid'

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
    const newQualifications = updateQualifications(qualifications)
    const { section, promptIndex, finished } = nextStepOfForm(
      config,
      progress,
      newQualifications,
    )

    const nextPage = `${urlPrefix}/${
      finished ? `results` : `/${section}/${promptIndex + 1}`
    }?q=${encodeQualifications(newQualifications)}`

    router.push(nextPage)
  }

  const goToPreviousQuestion = () => {
    const { section, promptIndex, isFirst } = previousStepOfForm(
      config,
      progress,
      qualifications,
    )
    if (isFirst) return

    const prevPage = `${urlPrefix}/${section}/${promptIndex + 1}?q=${encodeQualifications(qualifications)}`
    router.push(prevPage)
  }

  const skipAndGoNext = () => {
    // When skipping, use current qualifications (just mark as completed)
    const newQualifications = withCompletedPrompt(
      overallPromptIndex,
      qualifications,
    )
    const { section, promptIndex, finished } = nextStepOfForm(
      config,
      progress,
      newQualifications,
    )

    const nextPage = `${urlPrefix}/${
      finished ? `results` : `/${section}/${promptIndex + 1}`
    }?q=${encodeQualifications(newQualifications)}`

    router.push(nextPage)
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
      <h2 className="font-semibold text-2xl mb-2">
        {t(`${translationPrefix}.prompt`)}
      </h2>
      {prompt.maxPoints && (
        <p className="text-zinc-400 text-sm mb-5">
          {t('visa_form.points_hint.up_to', { points: prompt.maxPoints })}
          {' · '}
          <span className="text-zinc-500">
            {t('visa_form.points_hint.conditional')}
          </span>
        </p>
      )}
      {!prompt.maxPoints && <div className="mb-3" />}
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
      <div className="flex justify-end">
        <button
          type="button"
          className="button secondary w-full md:w-auto justify-center"
          onClick={() => {
            const resultsUrl = `${urlPrefix}/results?q=${encodeQualifications(
              qualifications,
            )}`
            router.push(resultsUrl)
          }}
        >
          {t(`visa_form.actions.go_to_results`)}
          <ChevronDoubleRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  )
}
