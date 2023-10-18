'use client'

import { BooleanPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from '@components/VisaFormSection'

export function BooleanPrompt({
  prompt,
  section,
  onSubmit,
}: {
  prompt: BooleanPrompt
  section: SectionName
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return <div>boolean prompt: {prompt.id}</div>
}
