'use client'

import { Criteria } from '@lib/domain'
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
      ) : (
        <div className="p-[2px] font-semibold rounded-lg bg-gradient-to-r from-amber-400 from-10% to-orange-500 to-90% relative">
          <div className="bg-zinc-950/80 px-6 py-4 rounded-lg space-y-2">
            <p>{t('banner.not_qualified', { pointsNeeded: 70 - points })}</p>
            <p className="text-sm font-normal text-zinc-400">
              {t('banner.not_qualified_hint')}
            </p>
          </div>
        </div>
      )}
      <section className="space-y-4">
        <h2 className="font-semibold text-2xl">{t('overview.title')}</h2>
        <MatchesOverview matches={matches} totalPoints={points} />
      </section>

      <section className="space-y-4">
        <h3 className="font-semibold text-xl">{t('evidence.title')}</h3>
        <p className="text-zinc-300 max-w-2xl">{t('evidence.description')}</p>
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

function MatchesOverview({
  matches,
  totalPoints,
}: {
  matches: Criteria[]
  totalPoints: number
}) {
  const t = useTranslations('results')

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-3 px-4 font-semibold text-zinc-300">
              {t('overview.category')}
            </th>
            <th className="text-left py-3 px-4 font-semibold text-zinc-300">
              {t('overview.explanation')}
            </th>
            <th className="text-right py-3 px-4 font-semibold text-zinc-300">
              {t('overview.points')}
            </th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr
              key={match.id}
              className={`border-b border-zinc-800 ${
                index % 2 === 0 ? 'bg-zinc-900/30' : ''
              }`}
            >
              <td className="py-3 px-4 text-zinc-300">
                {t(`criteria.${match.id}.category`)}
              </td>
              <td className="py-3 px-4 text-zinc-400">
                {t(`criteria.${match.id}.explanation`)}
              </td>
              <td className="py-3 px-4 text-right font-mono text-zinc-300">
                {match.points}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-zinc-600 font-semibold">
            <td className="py-3 px-4 text-zinc-200" colSpan={2}>
              {t('overview.total')}
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
  const t = useTranslations('results')

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Criteria[]> = {}
    for (const match of matches) {
      const category = t(`criteria.${match.id}.category`)
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(match)
    }
    return groups
  }, [matches, t])

  const categories = Object.keys(groupedByCategory)

  if (categories.length === 0) {
    return <p className="text-zinc-400 italic">{t('evidence.empty')}</p>
  }

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category}>
          <h4 className="font-semibold text-zinc-200 mb-3">{category}</h4>
          <div className="space-y-3">
            {groupedByCategory[category].map(match => (
              <EvidenceItemCard key={match.id} id={match.id} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function EvidenceItemCard({ id }: { id: string }) {
  const t = useTranslations('results')

  const description = t(`criteria.${id}.explanation`)
  const documentsKey = `evidence.items.${id}.documents`
  const notesKey = `evidence.items.${id}.notes`

  // Check if the translation exists (next-intl returns the key if not found)
  const documentsString = t(documentsKey)
  const hasDocuments = documentsString !== documentsKey
  const documents = hasDocuments ? documentsString.split(' | ') : []

  const notesString = t(notesKey)
  const notes = notesString !== notesKey ? notesString : undefined

  if (!hasDocuments && !notes) {
    return null
  }

  return (
    <div className="border border-zinc-800 rounded-lg p-4">
      <h5 className="font-medium text-zinc-300 mb-2">{description}</h5>
      {documents.length > 0 && (
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-400 pl-2">
          {documents.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      )}
      {notes && <p className="text-sm text-zinc-500 mt-2 italic">{notes}</p>}
    </div>
  )
}
