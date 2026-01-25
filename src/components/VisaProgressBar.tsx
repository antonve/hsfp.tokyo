import { FormConfig, getFormProgress } from '@lib/domain/form'
import { Qualifications } from '@lib/domain/qualifications'

export function VisaProgressBar({
  config,
  qualifications,
  doesQualify,
}: {
  config: FormConfig
  qualifications: Qualifications
  doesQualify: boolean
}) {
  const completed = Math.ceil(getFormProgress(config, qualifications))

  return (
    <div className="h-1 bg-surface-secondary w-full mx-auto">
      <div
        style={{ width: `${completed}%` }}
        className={`transition-all duration-1000 h-1 ease-out ${
          doesQualify ? 'bg-emerald-500' : 'bg-content-primary'
        }`}
      ></div>
    </div>
  )
}
