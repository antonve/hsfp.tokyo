import { NumberPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { VisaType } from '@lib/domain'

export function NumberPrompt({
  prompt,
  onSubmit,
  overallPromptIndex,
}: {
  visaType: VisaType
  section: SectionName
  prompt: NumberPrompt
  overallPromptIndex: number
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return <div>number prompt: {prompt.id}</div>
}
