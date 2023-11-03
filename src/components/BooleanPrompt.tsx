import { BooleanPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from '@components/VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'
import { VisaType } from '@lib/domain'
import { withCompletedPrompt } from '@lib/visa/prompts'

export function BooleanPrompt({
  visaType,
  section,
  prompt,
  overallPromptIndex,
  onSubmit,
}: {
  visaType: VisaType
  section: SectionName
  prompt: BooleanPrompt
  overallPromptIndex: number
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
