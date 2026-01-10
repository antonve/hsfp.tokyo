'use client'

import { Criteria } from '@lib/domain'
import { formConfigForVisa } from '@lib/domain/form'
import { calculatePoints } from '@lib/domain/qualifications'
import { useQualifications } from '@lib/hooks'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { useMemo, useState, useCallback, useEffect } from 'react'

interface Props {
  params: {
    visa: string
  }
}

const STORAGE_KEY = 'hsfp-evidence-checklist'

function useEvidenceChecklist() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        setCheckedItems(new Set(parsed))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const toggleItem = useCallback((itemId: string) => {
    setCheckedItems(prev => {
      const newChecked = new Set(prev)
      if (newChecked.has(itemId)) {
        newChecked.delete(itemId)
      } else {
        newChecked.add(itemId)
      }

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(Array.from(newChecked)),
        )
      } catch {
        // Ignore localStorage errors
      }

      return newChecked
    })
  }, [])

  return { checkedItems, toggleItem }
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
          <div className="bg-zinc-950/80 px-6 py-4 rounded-lg">
            <p>{t('banner.not_qualified', { pointsNeeded: 70 - points })}</p>
          </div>
        </div>
      )}
      {points < 70 && <HowToImprove />}
      {points >= 70 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h2 className="font-semibold text-2xl">{t('overview.title')}</h2>
              <MatchesOverview matches={matches} totalPoints={points} />
            </section>
            <section className="space-y-4">
              <h3 className="font-semibold text-2xl">{t('evidence.title')}</h3>
              <p className="text-zinc-300 text-sm">
                {t('evidence.description')}
              </p>
              <EvidenceOverview matches={matches} />
            </section>
          </div>
          <section className="space-y-4 max-w-2xl">
            <h3 className="font-semibold text-xl">
              {t('permanent_residency.title')}
            </h3>
            <p className="text-zinc-300">{t('permanent_residency.intro')}</p>
            <ul className="text-zinc-300 list-disc list-inside pl-4 space-y-2">
              <li> {t('permanent_residency.condition1')}</li>
              <li> {t('permanent_residency.condition2')}</li>
            </ul>
            <p className="text-zinc-300">
              {t('permanent_residency.visa_note')}
            </p>{' '}
            <p className="text-zinc-300">
              {t('permanent_residency.length_warning')}
            </p>
          </section>
        </>
      )}
      {points > 0 && points < 70 && (
        <section className="space-y-4">
          <h2 className="font-semibold text-2xl">{t('overview.title')}</h2>
          <MatchesOverview matches={matches} totalPoints={points} />
        </section>
      )}
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
  const { checkedItems, toggleItem } = useEvidenceChecklist()

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
    <div className="space-y-3">
      {categories.map(category => (
        <CollapsibleEvidenceCategory
          key={category}
          category={category}
          matches={groupedByCategory[category]}
          checkedItems={checkedItems}
          toggleItem={toggleItem}
        />
      ))}
    </div>
  )
}

function CollapsibleEvidenceCategory({
  category,
  matches,
  checkedItems,
  toggleItem,
}: {
  category: string
  matches: Criteria[]
  checkedItems: Set<string>
  toggleItem: (id: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const checkedCount = matches.filter(m => checkedItems.has(m.id)).length
  const totalCount = matches.length

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDownIcon className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-zinc-400" />
          )}
          <span className="font-semibold text-zinc-200">{category}</span>
        </div>
        <span className="text-sm text-zinc-400">
          {checkedCount}/{totalCount}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-zinc-800 p-4 space-y-3">
          {matches.map(match => (
            <EvidenceItemCard
              key={match.id}
              id={match.id}
              isChecked={checkedItems.has(match.id)}
              onToggle={() => toggleItem(match.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EvidenceItemCard({
  id,
  isChecked,
  onToggle,
}: {
  id: string
  isChecked: boolean
  onToggle: () => void
}) {
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
    <div
      className={`border rounded-lg p-4 transition-colors ${
        isChecked
          ? 'border-emerald-600 bg-emerald-950/20'
          : 'border-zinc-700 hover:border-zinc-600'
      }`}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="mt-1 w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
        />
        <div className="flex-1">
          <h5
            className={`font-medium mb-2 ${isChecked ? 'text-zinc-400 line-through' : 'text-zinc-300'}`}
          >
            {description}
          </h5>
          {documents.length > 0 && (
            <ul
              className={`list-disc list-inside space-y-1 text-sm pl-2 ${isChecked ? 'text-zinc-500' : 'text-zinc-400'}`}
            >
              {documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          )}
          {notes && (
            <p
              className={`text-sm mt-2 italic ${isChecked ? 'text-zinc-600' : 'text-zinc-500'}`}
            >
              {notes}
            </p>
          )}
        </div>
      </label>
    </div>
  )
}

function HowToImprove() {
  const t = useTranslations('results')

  const categories = [
    'experience',
    'salary',
    'japanese',
    'certifications',
  ] as const

  return (
    <section className="space-y-4 max-w-2xl">
      <h2 className="font-semibold text-2xl">{t('how_to_improve.title')}</h2>
      <p className="text-zinc-300">{t('how_to_improve.intro')}</p>
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category} className="border border-zinc-800 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-200 mb-2">
              {t(`how_to_improve.${category}.title`)}
            </h3>
            <p className="text-sm text-zinc-400">
              {t(`how_to_improve.${category}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
