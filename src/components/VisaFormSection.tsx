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
  const t = useTranslations(
    `visa_form.${config.visaType}.sections.${progress.section}`,
  )

  const prompts = config.sections[progress.section]!!
  const prompt = prompts[progress.promptIndex]
  const overallPromptIndex = getOverallPromptIndex(
    config,
    progress.section,
    progress.promptIndex,
  )

  const submit = (updateQualifications: QualificationUpdater) => {
    const { section, promptIndex } = nextStepOfForm(config, progress)
    const newQualifications = updateQualifications(qualifications)

    router.push(
      `/${language}/calculator/${params['visa']}/${section}/${
        promptIndex + 1
      }?q=${encodeQualifications(newQualifications)}`,
    )
  }

  return (
    <div className="pb-10">
      <h2 className="font-semibold text-2xl mb-5">
        {t(`${prompt.id}.prompt`)}
      </h2>
      <VisaFormPrompt
        qualifications={qualifications}
        prompt={prompt}
        onSubmit={submit}
        section={progress.section}
        visaType={config.visaType}
        overallPromptIndex={overallPromptIndex}
      />
    </div>
  )
}
