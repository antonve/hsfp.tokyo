import { FormConfig } from '@lib/domain/form'
import { Qualifications, calculatePoints } from '@lib/domain/qualifications'
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

  return <div className="">Points so far: {points}</div>
}
