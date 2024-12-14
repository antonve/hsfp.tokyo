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
import { FrequentlyAskedQuestions } from '@components/FrequentlyAskedQuestions'
import { useParams, useRouter } from 'next/navigation'
import { useLanguage } from '@lib/hooks'
import { useTranslations } from 'next-intl'

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
