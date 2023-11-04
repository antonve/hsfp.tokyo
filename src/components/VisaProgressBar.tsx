import {
  VisaProgress,
  FormConfig,
  SectionName,
  getOverallPromptIndex,
} from '@lib/domain/form'
import { Qualifications } from '@lib/domain/qualifications'
import { isPromptCompleted } from '@lib/domain/prompts'
export function VisaProgressBar({
  config,
  qualifications,
}: {
  config: FormConfig
  qualifications: Qualifications
}) {
  const totalPrompts = Object.values(config.sections).reduce(
    (accumulator, value) => accumulator + value.length,
    0,
  )
  const sections: SectionName[] = config.order
  let progress: number = 0

  sections.map(section => {
    const startPromptId = getOverallPromptIndex(config, section, 0)
    const prompts = config.sections[section]?.length ?? 0
    const promptIdsToCheck = [...Array(prompts)].map(
      (_, i) => i + startPromptId,
    )
    promptIdsToCheck.map(promptId => {
      if (isPromptCompleted(promptId, qualifications)) {
        progress += 1
      }
    })
  })

  const completed = (progress / totalPrompts) * 100

  return (
    <div className=" h-2 bg-gray-200 w-full mx-auto">
      <div style={{ width: `${completed}%` }}>
        <div className={`h-2 bg-red-500 `} />
      </div>
    </div>
  )
}
