import classNames from 'classnames'

export function VisaFormResultsPreview({
  points,
  doesQualify,
}: {
  points: number
  doesQualify: boolean
}) {
  const label = doesQualify
    ? 'Congrats, you qualify for the visa!'
    : 'You need at least 70 points to qualify'

  return (
    <div
      className={classNames(`px-8 py-4 flex items-center justify-between`, {
        'bg-emerald-700': doesQualify,
        'bg-zinc-900/50': !doesQualify,
      })}
    >
      <div className="ont-semibold">{label}</div>
      <span className="font-semibold">
        <span className="text-2xl font-bold">{points}</span> points
      </span>
    </div>
  )
}
