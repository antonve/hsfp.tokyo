'use client'

import { BooleanPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from '@components/VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'

export function BooleanPrompt({
  prompt,
  onSubmit,
}: {
  prompt: BooleanPrompt
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return (
    <ChoicePrompt
      prompt={{
        id: prompt.id,
        type: 'CHOICE',
        options: ['true', 'false'],
      }}
      onSubmit={onSubmit}
      qualificationUpdater={value => q => ({
        ...q,
        [prompt.id]: value === 'false' ? undefined : true,
      })}
    />
  )
}
