'use client'

import { Criteria } from '@lib/domain'
import { criteriaMetadata } from '@lib/domain/criteria.metadata'
import { formConfigForVisa } from '@lib/domain/form'
import { calculatePoints } from '@lib/domain/qualifications'
import { useQualifications } from '@lib/hooks'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface Props {
  params: {
    visa: string
  }
}

export default function Page({ params }: Props) {
  const t = useTranslations('results')

  const formConfig = formConfigForVisa(params.visa)!
  const qualifications = useQualifications(formConfig.visaType)
  const { points, matches } = useMemo(
    () => calculatePoints(qualifications),
    [qualifications],
  )

  const visaType = t(`visa_type.${formConfig.visaType}`)

  return (
    <main className="space-y-8">
      {points >= 70 ? (
        <div className=" p-[2px] font-semibold rounded-lg bg-gradient-to-r from-emerald-300 from-10% to-emerald-500 to-90% relative">
          <span className="absolute -top-3 -left-2 text-4xl"> &#x1f389;</span>
          <span className="absolute -bottom-3 -right-3 text-4xl">
            &#128640;
          </span>
          <div className="bg-zinc-950/80 px-6 py-4 rounded-lg">
            {t('banner.qualified', { visaType })}
          </div>
        </div>
      ) : null}
      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">{t('overview.title')}</h2>
        <MatchesOverview matches={matches} />
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-xl">{t('evidence.title')}</h3>
        <p className="text-zinc-300 max-w-2xl">
          {t('evidence.description', {
            visaType,
          })}
        </p>
      </section>
      <EvidenceOverview matches={matches} />
      <section className="space-y-4 max-w-2xl">
        <h3 className="font-semibold text-xl">
          {t('permanent_residency.title')}
        </h3>
        <p className="text-zinc-300">{t('permanent_residency.intro')}</p>
        <ul className="text-zinc-300 list-disc list-inside pl-4 space-y-2">
          <li> {t('permanent_residency.condition1')}</li>
          <li> {t('permanent_residency.condition2')}</li>
        </ul>
        <p className="text-zinc-300">{t('permanent_residency.visa_note')}</p>{' '}
        <p className="text-zinc-300">
          {t('permanent_residency.length_warning')}
        </p>
      </section>
    </main>
  )
}

function MatchesOverview({ matches }: { matches: Criteria[] }) {
  const totalPoints = matches.reduce((sum, match) => sum + match.points, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-3 px-4 font-semibold text-zinc-300">
              Category
            </th>
            <th className="text-left py-3 px-4 font-semibold text-zinc-300">
              Explanation
            </th>
            <th className="text-right py-3 px-4 font-semibold text-zinc-300">
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => {
            const metadata = criteriaMetadata[match.id]
            return (
              <tr
                key={match.id}
                className={`border-b border-zinc-800 ${
                  index % 2 === 0 ? 'bg-zinc-900/30' : ''
                }`}
              >
                <td className="py-3 px-4 text-zinc-300">
                  {metadata?.category || match.id}
                </td>
                <td className="py-3 px-4 text-zinc-400">
                  {metadata?.explanation || match.id}
                </td>
                <td className="py-3 px-4 text-right font-mono text-zinc-300">
                  {match.points}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-zinc-600 font-semibold">
            <td className="py-3 px-4 text-zinc-200" colSpan={2}>
              Total
            </td>
            <td className="py-3 px-4 text-right font-mono text-zinc-200">
              {totalPoints}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function EvidenceOverview({ matches }: { matches: Criteria[] }) {
  return 'todo'
}
