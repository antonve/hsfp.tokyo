import { NumberPrompt, SectionName } from '@lib/domain/form'
import { QualificationUpdater } from './VisaFormSection'
import { VisaType } from '@lib/domain'
import { Qualifications } from '@lib/domain/qualifications'

export function NumberPrompt({
  prompt,
  onSubmit,
  overallPromptIndex,
}: {
  qualifications: Qualifications
  visaType: VisaType
  section: SectionName
  prompt: NumberPrompt
  overallPromptIndex: number
  onSubmit: (updateQualifications: QualificationUpdater) => void
}) {
  return <div>number prompt: {prompt.id}</div>
}
