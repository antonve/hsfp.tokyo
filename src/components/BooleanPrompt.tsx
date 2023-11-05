import { BooleanPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from '@components/VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'
import { VisaType } from '@lib/domain'
import { withCompletedPrompt } from '@lib/domain/prompts'
import { Qualifications } from '@lib/domain/qualifications'

export function BooleanPrompt({
  qualifications,
  visaType,
  section,
  prompt,
  overallPromptIndex,
  onSubmit,
}: {
  qualifications: Qualifications
  visaType: VisaType
  section: SectionName
  prompt: BooleanPrompt
  overallPromptIndex: number
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return (
    <ChoicePrompt
      qualifications={qualifications}
      prompt={{
        id: prompt.id,
        type: 'CHOICE',
        options: ['true', 'false'],
      }}
      onSubmit={onSubmit}
      overallPromptIndex={overallPromptIndex}
      qualificationUpdater={value => q => ({
        ...withCompletedPrompt(overallPromptIndex, q),
        [prompt.id]: value === 'false' ? undefined : true,
      })}
      visaType={visaType}
      section={section}
    />
  )
}
