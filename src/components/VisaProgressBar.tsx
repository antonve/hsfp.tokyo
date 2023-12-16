import { FormConfig } from '@lib/domain/form'
import { Qualifications } from '@lib/domain/qualifications'
import { isPromptCompleted } from '@lib/domain/prompts'

function getFormProgress(config: FormConfig, qualifications: Qualifications) {
  const totalPrompts = Object.values(config.order).reduce(
    (accumulator, value) => accumulator + value.length,
    0,
  )
  let progress: number = 0
  for (let i = 0; i < totalPrompts; i++) {
    if (isPromptCompleted(i, qualifications)) {
      progress += 1
    }
  }
  const completed = (progress / totalPrompts) * 100

  return completed
}

export function VisaProgressBar({
  config,
  qualifications,
}: {
  config: FormConfig
  qualifications: Qualifications
}) {
  const completed = getFormProgress(config, qualifications)

  return (
    <div className=" h-2 bg-zinc-950 w-full mx-auto">
      <div style={{ width: `${completed}%` }}>
        <div className={`h-2 bg-red-500 `} />
      </div>
    </div>
  )
}
