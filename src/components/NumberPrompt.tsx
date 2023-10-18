'use client'

import { NumberPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'

export function NumberPrompt({
  prompt,
  section,
  onSubmit,
}: {
  prompt: NumberPrompt
  section: SectionName
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return <div>number prompt: {prompt.id}</div>
}
