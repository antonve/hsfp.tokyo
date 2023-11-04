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
import { VisaProgressBar } from './VisaProgressBar'

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
      `/${language}/calculator/${params['visa']}/${section}/${promptIndex + 1
      }?q=${encodeQualifications(newQualifications)}`,
    )
  }

  return (
    <div className="pb-10">
      <h2 className="font-bold text-xl mb-4">{progress.section}</h2>
      <VisaFormPrompt
        prompt={prompt}
        onSubmit={submit}
        section={progress.section}
        visaType={config.visaType}
        overallPromptIndex={overallPromptIndex}
      />
    </div>
  )
}
