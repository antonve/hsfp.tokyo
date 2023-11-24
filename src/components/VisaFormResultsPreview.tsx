import { FormConfig } from '@lib/domain/form'
import { Qualifications, calculatePoints } from '@lib/domain/qualifications'
import classNames from 'classnames'
import { useMemo } from 'react'

export function VisaFormResultsPreview({
  config,
  qualifications,
}: {
  config: FormConfig
  qualifications: Qualifications
}) {
  const { points } = useMemo(
    () => calculatePoints(qualifications),
    [qualifications],
  )
  const doesQualify = points >= 70
  const label = doesQualify
    ? 'Congrats, you qualify for the visa!'
    : 'You need at least 70 points to qualify'

  return (
    <div
      className={classNames(`px-8 py-4 flex items-center justify-between`, {
        'bg-emerald-700': doesQualify,
        'bg-stone-900/50': !doesQualify,
      })}
    >
      <div className="ont-semibold">{label}</div>
      <span className="font-semibold">
        <span className="text-2xl font-bold">{points}</span> points
      </span>
    </div>
  )
}
