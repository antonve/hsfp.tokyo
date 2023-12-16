import { FormConfig, getFormProgress } from '@lib/domain/form'
import { Qualifications } from '@lib/domain/qualifications'

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
