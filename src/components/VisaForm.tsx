'use client'

import { FormConfig } from '@lib/domain/form'
import { useQualifications, useVisaFormProgress } from '@lib/hooks'
import { VisaFormSection } from '@components/VisaFormSection'

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const qualifications = useQualifications(config.visaType)
  const progress = useVisaFormProgress(config)

  return (
    <VisaFormSection
      config={config}
      progress={progress}
      qualifications={qualifications}
    />
  )
}
