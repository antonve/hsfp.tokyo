import classNames from 'classnames'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import { useTranslations } from 'next-intl'

export function VisaFormResultsPreview({
  points,
  doesQualify,
}: {
  points: number
  doesQualify: boolean
}) {
  const t = useTranslations('results.preview')
  const label = doesQualify
    ? t('qualified')
    : t('not_qualified', { threshold: HSFP_QUALIFICATION_THRESHOLD })

  return (
    <div
      className={classNames(`px-8 py-4 flex items-center justify-between`, {
        'bg-emerald-700': doesQualify,
        'bg-surface-secondary/50': !doesQualify,
      })}
    >
      <div className="ont-semibold">{label}</div>
      <span className="font-semibold">
        <span className="text-2xl font-bold">{points}</span> points
      </span>
    </div>
  )
}
