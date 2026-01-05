'use client'

import { Criteria } from '@lib/domain'
import { criteriaMetadata } from '@lib/domain/criteria.metadata'
import {
  EvidenceItem,
  getEvidenceForMatches,
  groupEvidenceByCategory,
} from '@lib/domain/evidence.metadata'
import { formConfigForVisa } from '@lib/domain/form'
import { calculatePoints } from '@lib/domain/qualifications'
import { useQualifications } from '@lib/hooks'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

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
  const evidenceItems = useMemo(() => getEvidenceForMatches(matches), [matches])
  const groupedEvidence = useMemo(
    () => groupEvidenceByCategory(evidenceItems),
    [evidenceItems],
  )

  const categories = Object.keys(groupedEvidence)

  if (categories.length === 0) {
    return (
      <p className="text-zinc-400 italic">
        No specific evidence requirements based on your selections.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <EvidenceCategorySection
          key={category}
          category={category}
          items={groupedEvidence[category]}
        />
      ))}
    </div>
  )
}

function EvidenceCategorySection({
  category,
  items,
}: {
  category: string
  items: EvidenceItem[]
}) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors"
      >
        <span className="font-semibold text-zinc-200">{category}</span>
        <span className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-zinc-400" />
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="divide-y divide-zinc-800">
          {items.map(item => (
            <EvidenceItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function EvidenceItemCard({ item }: { item: EvidenceItem }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="px-4 py-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between text-left"
      >
        <div className="flex-1">
          <h4 className="font-medium text-zinc-300">{item.description}</h4>
          <p className="text-sm text-zinc-500 mt-1">
            {item.documents.length} required{' '}
            {item.documents.length === 1 ? 'document' : 'documents'}
          </p>
        </div>
        {isExpanded ? (
          <ChevronDownIcon className="w-4 h-4 text-zinc-400 mt-1 flex-shrink-0" />
        ) : (
          <ChevronRightIcon className="w-4 h-4 text-zinc-400 mt-1 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <div>
            <h5 className="text-sm font-medium text-zinc-400 mb-2">
              Required Documents:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300 pl-2">
              {item.documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>

          {item.notes && (
            <div className="bg-zinc-900/50 rounded p-3 border-l-2 border-emerald-500/50">
              <h5 className="text-sm font-medium text-zinc-400 mb-1">Note:</h5>
              <p className="text-sm text-zinc-400">{item.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
