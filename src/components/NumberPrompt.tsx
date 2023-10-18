'use client'

import { NumberPrompt } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'

export function NumberPrompt({
  prompt,
  onSubmit,
}: {
  prompt: NumberPrompt
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return <div>number prompt: {prompt.id}</div>
}
