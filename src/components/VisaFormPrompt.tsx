'use client'

import { Prompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'
import { BooleanPrompt } from './BooleanPrompt'
import { NumberPrompt } from './NumberPrompt'

export function VisaFormPrompt({
  prompt,
  section,
  onSubmit,
}: {
  prompt: Prompt
  section: SectionName
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div>
          <NumberPrompt prompt={prompt} onSubmit={onSubmit} section={section} />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div>
          <BooleanPrompt
            prompt={prompt}
            onSubmit={onSubmit}
            section={section}
          />
        </div>
      )
    case 'CHOICE':
      return (
        <div>
          <ChoicePrompt prompt={prompt} onSubmit={onSubmit} section={section} />
        </div>
      )
  }
}
