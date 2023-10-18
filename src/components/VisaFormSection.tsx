'use client'

import { FormConfig, VisaProgress, nextStepOfForm } from '@lib/domain/form'
import { Qualifications, encodeQualifications } from '@lib/visa'
import { VisaFormPrompt } from '@components/VisaFormPrompt'
import { useParams, useRouter } from 'next/navigation'

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

  const prompts = config.sections[progress.section]!!
  const prompt = prompts[progress.promptIndex]

  const submit = (updateQualifications: QualificationUpdater) => {
    const { section, promptIndex } = nextStepOfForm(config, progress)
    const newQualifications = updateQualifications(qualifications)

    router.push(
      `/calculator/${params['visa']}/${section}/${
        promptIndex + 1
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
      />
    </div>
  )
}