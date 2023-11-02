'use client'

import { Prompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'
import { BooleanPrompt } from './BooleanPrompt'
import { NumberPrompt } from './NumberPrompt'
import { VisaType } from '@lib/domain'

export function VisaFormPrompt({
  visaType,
  section,
  prompt,
  onSubmit,
}: {
  visaType: VisaType
  section: SectionName
  prompt: Prompt
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div>
          <NumberPrompt
            prompt={prompt}
            onSubmit={onSubmit}
            visaType={visaType}
            section={section}
          />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div>
          <BooleanPrompt
            prompt={prompt}
            onSubmit={onSubmit}
            visaType={visaType}
            section={section}
          />
        </div>
      )
    case 'CHOICE':
      return (
        <div>
          <ChoicePrompt
            prompt={prompt}
            onSubmit={onSubmit}
            visaType={visaType}
            section={section}
          />
        </div>
      )
  }
}
