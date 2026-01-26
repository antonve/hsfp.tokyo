'use client'

import { Prompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'
import { BooleanPrompt } from './BooleanPrompt'
import { NumberPrompt } from './NumberPrompt'
import { VisaType } from '@lib/domain'
import { Qualifications } from '@lib/domain/qualifications'

export function VisaFormPrompt({
  qualifications,
  visaType,
  section,
  prompt,
  overallPromptIndex,
  onSubmit,
  isLoading,
}: {
  qualifications: Qualifications
  visaType: VisaType
  section: SectionName
  prompt: Prompt
  overallPromptIndex: number
  onSubmit: (updateQualifications: QualificationUpdater) => void
  isLoading: boolean
}) {
  switch (prompt.type) {
    case 'NUMBER':
      return (
        <div>
          <NumberPrompt
            qualifications={qualifications}
            prompt={prompt}
            onSubmit={onSubmit}
            visaType={visaType}
            section={section}
            overallPromptIndex={overallPromptIndex}
            isLoading={isLoading}
          />
        </div>
      )
    case 'BOOLEAN':
      return (
        <div>
          <BooleanPrompt
            qualifications={qualifications}
            prompt={prompt}
            onSubmit={onSubmit}
            visaType={visaType}
            section={section}
            overallPromptIndex={overallPromptIndex}
            isLoading={isLoading}
          />
        </div>
      )
    case 'CHOICE':
      return (
        <div>
          <ChoicePrompt
            qualifications={qualifications}
            prompt={prompt}
            onSubmit={onSubmit}
            visaType={visaType}
            section={section}
            overallPromptIndex={overallPromptIndex}
            isLoading={isLoading}
          />
        </div>
      )
  }
}
