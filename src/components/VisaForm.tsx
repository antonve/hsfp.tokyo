'use client'

import { FormConfig } from '@lib/domain/form'
import {
  useQualifications,
  useVisaFormProgress,
  useIsStateOutdated,
} from '@lib/hooks'
import { VisaFormSection } from '@components/VisaFormSection'
import { OutdatedStateError } from '@components/OutdatedStateError'

interface Props {
  config: FormConfig
}

export function VisaForm({ config }: Props) {
  const qualifications = useQualifications(config.visaType)
  const progress = useVisaFormProgress(config)
  const isOutdated = useIsStateOutdated()

  if (isOutdated) {
    return <OutdatedStateError visaSlug={config.visaType} />
  }

  return (
    <VisaFormSection
      config={config}
      progress={progress}
      qualifications={qualifications}
    />
  )
}
