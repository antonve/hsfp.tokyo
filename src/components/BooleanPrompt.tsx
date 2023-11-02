import { BooleanPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from '@components/VisaFormSection'
import { ChoicePrompt } from './ChoicePrompt'
import { VisaType } from '@lib/domain'

export function BooleanPrompt({
  visaType,
  section,
  prompt,
  onSubmit,
}: {
  visaType: VisaType
  section: SectionName
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
      visaType={visaType}
      section={section}
    />
  )
}
