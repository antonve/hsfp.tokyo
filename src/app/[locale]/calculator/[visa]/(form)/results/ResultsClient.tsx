'use client'

import { Criteria } from '@lib/domain'
import { formConfigForVisa } from '@lib/domain/form'
import {
  calculatePoints,
  encodeQualifications,
} from '@lib/domain/qualifications'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import { useQualifications, useSessionId, useIsStateOutdated } from '@lib/hooks'
import { OutdatedStateError } from '@components/OutdatedStateError'
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo, useState, useCallback, useEffect } from 'react'

interface Props {
  visa: string
}

const STORAGE_KEY_PREFIX = 'hsfp-evidence'

function EditAnswersButton({ editUrl }: { editUrl: string }) {
  return (
    <Link
      href={editUrl}
      className="button secondary flex items-center gap-2 text-sm no-underline"
    >
      <PencilSquareIcon className="w-4 h-4" />
      Edit Answers
    </Link>
  )
}

function useEvidenceChecklist(sessionId: string | undefined) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  // Generate storage key based on sessionId
  const storageKey = sessionId ? `${STORAGE_KEY_PREFIX}-${sessionId}` : null

  useEffect(() => {
    if (!storageKey) return

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        setCheckedItems(new Set(parsed))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey])

  const toggleItem = useCallback(
    (itemId: string) => {
      if (!storageKey) return

      setCheckedItems(prev => {
        const newChecked = new Set(prev)
        if (newChecked.has(itemId)) {
          newChecked.delete(itemId)
        } else {
          newChecked.add(itemId)
        }

        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify(Array.from(newChecked)),
          )
        } catch {
          // Ignore localStorage errors
        }

        return newChecked
      })
    },
    [storageKey],
  )

  return { checkedItems, toggleItem }
}

export default function ResultsClient({ visa }: Props) {
  const t = useTranslations('results')

  const formConfig = formConfigForVisa(visa)!
  const qualifications = useQualifications(formConfig.visaType)
  const sessionId = useSessionId()
  const isOutdated = useIsStateOutdated()
  const { points, matches } = useMemo(() => {
    try {
      return calculatePoints(qualifications)
    } catch {
      return { points: 0, matches: [] }
    }
  }, [qualifications])

  const visaType = t(`visa_type.${formConfig.visaType}`)
  const firstSection = formConfig.order[0]
  const editUrl = `/calculator/${visa}/${firstSection}/1?q=${encodeQualifications(qualifications)}`
  const missingSalary =
    qualifications.salary === undefined || qualifications.salary < 3_000_000

  if (isOutdated) {
    return <OutdatedStateError visaSlug={formConfig.visaType} />
  }

  return (
    <main className="space-y-8">
      {missingSalary && (
        <div className="p-4 border-2 border-red-300 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {t('banner.missing_salary')}
          </p>
        </div>
      )}
      {points >= HSFP_QUALIFICATION_THRESHOLD ? (
        <div className="p-[2px] font-semibold rounded-lg bg-gradient-to-r from-emerald-300 from-10% to-emerald-500 to-90% relative motion-preset-expand motion-duration-500">
          <span className="absolute -top-3 -left-2 text-4xl"> &#x1f389;</span>
          <span className="absolute -bottom-3 -right-3 text-4xl">
            &#128640;
          </span>
          <div className="bg-white/80 dark:bg-zinc-950/80 px-6 py-4 rounded-lg">
            {t('banner.qualified', { visaType })}
          </div>
        </div>
      ) : (
        <div className="p-[2px] font-semibold rounded-lg bg-gradient-to-r from-amber-400 from-10% to-orange-500 to-90% relative motion-preset-expand motion-duration-500">
          <div className="bg-white/80 dark:bg-zinc-950/80 px-6 py-4 rounded-lg">
            <p>
              {t('banner.not_qualified', {
                pointsNeeded: HSFP_QUALIFICATION_THRESHOLD - points,
              })}
            </p>
          </div>
        </div>
      )}
      {points === 0 && <HowToImprove showEditButton editUrl={editUrl} />}
      {points > 0 && points < HSFP_QUALIFICATION_THRESHOLD && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-2xl">{t('overview.title')}</h2>
              <EditAnswersButton editUrl={editUrl} />
            </div>
            <MatchesOverview matches={matches} totalPoints={points} />
          </section>
          <HowToImprove showEditButton={false} editUrl={editUrl} />
        </div>
      )}
      {points >= HSFP_QUALIFICATION_THRESHOLD && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-2xl">
                  {t('overview.title')}
                </h2>
                <EditAnswersButton editUrl={editUrl} />
              </div>
              <MatchesOverview matches={matches} totalPoints={points} />
            </section>
            <section className="space-y-4">
              <h3 className="font-semibold text-2xl">{t('evidence.title')}</h3>
              <div className="text-zinc-700 dark:text-zinc-300 text-sm space-y-3">
                <p>{t('evidence.description1')}</p>
                <p>{t('evidence.description2')}</p>
                <p>{t('evidence.description3')}</p>
              </div>
              <EvidenceOverview matches={matches} sessionId={sessionId} />
            </section>
          </div>
          <section className="space-y-4 max-w-2xl">
            <h3 className="font-semibold text-xl">
              {t('permanent_residency.title')}
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              {t('permanent_residency.intro')}
            </p>
            <ul className="text-zinc-700 dark:text-zinc-300 list-disc list-inside pl-4 space-y-2">
              <li> {t('permanent_residency.condition1')}</li>
              <li> {t('permanent_residency.condition2')}</li>
            </ul>
            <p className="text-zinc-700 dark:text-zinc-300">
              {t('permanent_residency.visa_note')}
            </p>{' '}
            <p className="text-zinc-700 dark:text-zinc-300">
              {t('permanent_residency.length_warning')}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              {t('permanent_residency.political_caveat')}
            </p>
          </section>
        </>
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

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
              <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">
                {t('overview.explanation')}
              </th>
              <th className="text-right py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                {t('overview.points')}
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, categoryIndex) => {
              const categoryMatches = groupedByCategory[category]
              const categoryPoints = categoryMatches.reduce(
                (sum, m) => sum + m.points,
                0,
              )

              return (
                <CategoryGroup
                  key={category}
                  category={category}
                  matches={categoryMatches}
                  categoryPoints={categoryPoints}
                  categoryIndex={categoryIndex}
                />
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-zinc-200 dark:border-zinc-800 font-semibold bg-zinc-100 dark:bg-zinc-900">
              <td className="py-3 px-4 text-zinc-900 dark:text-gray-50">
                {t('overview.total')}
              </td>
              <td className="py-3 px-4 text-right font-mono text-zinc-900 dark:text-gray-50">
                {totalPoints}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
        {t('overview.disclaimer')}
      </p>
    </div>
  )
}

function CategoryGroup({
  category,
  matches,
  categoryPoints,
  categoryIndex,
}: {
  category: string
  matches: Criteria[]
  categoryPoints: number
  categoryIndex: number
}) {
  const t = useTranslations('results')

  return (
    <>
      <tr
        className="bg-zinc-50 dark:bg-zinc-900/50 motion-preset-fade motion-duration-300"
        style={{ animationDelay: `${categoryIndex * 75}ms` }}
      >
        <td className="py-2 px-4 font-semibold text-zinc-800 dark:text-zinc-200">
          {category}
        </td>
        <td className="py-2 px-4 text-right font-mono font-semibold text-zinc-800 dark:text-zinc-200">
          {categoryPoints}
        </td>
      </tr>
      {matches.map((match, index) => (
        <tr
          key={match.id}
          className="border-b border-zinc-100 dark:border-zinc-900 motion-preset-fade motion-duration-300 bg-white dark:bg-zinc-950"
          style={{
            animationDelay: `${categoryIndex * 75 + (index + 1) * 50}ms`,
          }}
        >
          <td className="py-2 px-4 pl-8 text-zinc-500 dark:text-zinc-400">
            {t(`criteria.${match.id}.explanation`)}
          </td>
          <td className="py-2 px-4 text-right font-mono text-zinc-500 dark:text-zinc-400">
            {match.points}
          </td>
        </tr>
      ))}
    </>
  )
}

function EvidenceOverview({
  matches,
  sessionId,
}: {
  matches: Criteria[]
  sessionId: string | undefined
}) {
  const t = useTranslations('results')
  const { checkedItems, toggleItem } = useEvidenceChecklist(sessionId)

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
    return (
      <p className="text-zinc-500 dark:text-zinc-400 italic">
        {t('evidence.empty')}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {categories.map((category, index) => (
        <div
          key={category}
          className="motion-preset-slide-up motion-duration-300"
          style={{ animationDelay: `${index * 75}ms` }}
        >
          <CollapsibleEvidenceCategory
            category={category}
            matches={groupedByCategory[category]}
            checkedItems={checkedItems}
            toggleItem={toggleItem}
          />
        </div>
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
    <div className="border border-zinc-100 dark:border-zinc-900 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDownIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          )}
          <span className="font-semibold text-zinc-900 dark:text-gray-50">
            {category}
          </span>
        </div>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {checkedCount}/{totalCount}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-zinc-100 dark:border-zinc-900 p-4 space-y-3 motion-preset-slide-down motion-duration-200">
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
  const hasDocuments =
    documentsString &&
    documentsString !== documentsKey &&
    !documentsString.includes('evidence.items')
  const documents = hasDocuments ? documentsString.split(' | ') : []

  const notesString = t(notesKey)
  // Only use notes if translation exists (not a key pattern)
  const hasNotes =
    notesString &&
    notesString !== notesKey &&
    !notesString.includes('evidence.items')
  const notes = hasNotes ? notesString : undefined

  if (!hasDocuments && !notes) {
    return null
  }

  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        isChecked
          ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
          : 'border-zinc-300 dark:border-zinc-900 hover:border-zinc-500 dark:hover:border-zinc-700'
      }`}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="mt-1 w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
        />
        <div className="flex-1">
          <h5
            className={`font-medium mb-2 ${isChecked ? 'text-zinc-500 dark:text-zinc-400 line-through' : 'text-zinc-700 dark:text-zinc-300'}`}
          >
            {description}
          </h5>
          {documents.length > 0 && (
            <ul
              className={`list-disc list-inside space-y-1 text-sm pl-2 ${isChecked ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'}`}
            >
              {documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          )}
          {notes && (
            <p
              className={`text-sm mt-2 italic ${isChecked ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'}`}
            >
              {notes}
            </p>
          )}
        </div>
      </label>
    </div>
  )
}

function HowToImprove({
  showEditButton,
  editUrl,
}: {
  showEditButton: boolean
  editUrl: string
}) {
  const t = useTranslations('results')

  const categories = [
    'experience',
    'salary',
    'japanese',
    'certifications',
  ] as const

  return (
    <section className="space-y-4">
      {showEditButton ? (
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl">
            {t('how_to_improve.title')}
          </h2>
          <EditAnswersButton editUrl={editUrl} />
        </div>
      ) : (
        <h2 className="font-semibold text-2xl">{t('how_to_improve.title')}</h2>
      )}
      <p className="text-zinc-700 dark:text-zinc-300">
        {t('how_to_improve.intro')}
      </p>
      <div className="space-y-4">
        {categories.map(category => (
          <div
            key={category}
            className="rounded-lg p-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-100 hover:dark:bg-zinc-900 dark:bg-zinc-900/80 shadow-sm shadow-zinc-300 dark:shadow-black"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-gray-50 mb-2">
              {t(`how_to_improve.${category}.title`)}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t(`how_to_improve.${category}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
