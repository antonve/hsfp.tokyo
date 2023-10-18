'use client'

import { Prompt } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'
import { BooleanPrompt } from './BooleanPrompt'
import { NumberPrompt } from './NumberPrompt'

export function VisaFormPrompt({
  prompt,
  onSubmit,
}: {
  prompt: Prompt
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div>
          <NumberPrompt prompt={prompt} onSubmit={onSubmit} />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div>
          <BooleanPrompt prompt={prompt} onSubmit={onSubmit} />
        </div>
      )
    case 'CHOICE':
      return (
        <div>
          <ChoicePrompt prompt={prompt} onSubmit={onSubmit} />
        </div>
      )
  }
}
