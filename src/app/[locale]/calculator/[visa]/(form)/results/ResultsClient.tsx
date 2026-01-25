'use client'

import { Criteria } from '@lib/domain'
import { formConfigForVisa } from '@lib/domain/form'
import {
  calculatePoints,
  encodeQualifications,
} from '@lib/domain/qualifications'
import { HSFP_QUALIFICATION_THRESHOLD } from '@lib/domain/constants'
import { useQualifications, useSessionId } from '@lib/hooks'
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

  return (
    <main className="space-y-8">
      {missingSalary && (
        <div className="p-4 border-2 border-red-800 rounded-lg bg-red-950/20">
          <p className="text-red-400 font-medium">
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
          <div className="bg-surface-primary/80 px-6 py-4 rounded-lg">
            {t('banner.qualified', { visaType })}
          </div>
        </div>
      ) : (
        <div className="p-[2px] font-semibold rounded-lg bg-gradient-to-r from-amber-400 from-10% to-orange-500 to-90% relative motion-preset-expand motion-duration-500">
          <div className="bg-surface-primary/80 px-6 py-4 rounded-lg">
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
              <div className="text-content-secondary text-sm space-y-3">
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
            <p className="text-content-secondary">
              {t('permanent_residency.intro')}
            </p>
            <ul className="text-content-secondary list-disc list-inside pl-4 space-y-2">
              <li> {t('permanent_residency.condition1')}</li>
              <li> {t('permanent_residency.condition2')}</li>
            </ul>
            <p className="text-content-secondary">
              {t('permanent_residency.visa_note')}
            </p>{' '}
            <p className="text-content-secondary">
              {t('permanent_residency.length_warning')}
            </p>
            <p className="text-sm text-content-muted italic">
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

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-content-secondary">
                {t('overview.category')}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-content-secondary">
                {t('overview.explanation')}
              </th>
              <th className="text-right py-3 px-4 font-semibold text-content-secondary">
                {t('overview.points')}
              </th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr
                key={match.id}
                className={`border-b border-border-subtle motion-preset-fade motion-duration-300 bg-surface-secondary ${
                  index % 2 === 0 ? 'bg-surface-secondary/30' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-3 px-4 text-content-secondary">
                  {t(`criteria.${match.id}.category`)}
                </td>
                <td className="py-3 px-4 text-content-muted">
                  {t(`criteria.${match.id}.explanation`)}
                </td>
                <td className="py-3 px-4 text-right font-mono text-content-secondary">
                  {match.points}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border font-semibold">
              <td className="py-3 px-4 text-content-primary" colSpan={2}>
                {t('overview.total')}
              </td>
              <td className="py-3 px-4 text-right font-mono text-content-primary">
                {totalPoints}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-sm text-content-muted italic">
        {t('overview.disclaimer')}
      </p>
    </div>
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
    return <p className="text-content-muted italic">{t('evidence.empty')}</p>
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
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-tertiary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isOpen ? (
            <ChevronDownIcon className="w-5 h-5 text-content-muted" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-content-muted" />
          )}
          <span className="font-semibold text-content-primary">{category}</span>
        </div>
        <span className="text-sm text-content-muted">
          {checkedCount}/{totalCount}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-border-subtle p-4 space-y-3 motion-preset-slide-down motion-duration-200">
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
          ? 'border-emerald-600 bg-emerald-950/20'
          : 'border-border hover:border-content-muted'
      }`}
    >
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="mt-1 w-4 h-4 rounded border-border bg-surface-tertiary text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
        />
        <div className="flex-1">
          <h5
            className={`font-medium mb-2 ${isChecked ? 'text-content-muted line-through' : 'text-content-secondary'}`}
          >
            {description}
          </h5>
          {documents.length > 0 && (
            <ul
              className={`list-disc list-inside space-y-1 text-sm pl-2 ${isChecked ? 'text-content-muted' : 'text-content-muted'}`}
            >
              {documents.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          )}
          {notes && (
            <p
              className={`text-sm mt-2 italic ${isChecked ? 'text-content-muted' : 'text-content-muted'}`}
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
      <p className="text-content-secondary">{t('how_to_improve.intro')}</p>
      <div className="space-y-4">
        {categories.map(category => (
          <div
            key={category}
            className="border border-border-subtle rounded-lg p-4"
          >
            <h3 className="font-semibold text-content-primary mb-2">
              {t(`how_to_improve.${category}.title`)}
            </h3>
            <p className="text-sm text-content-muted">
              {t(`how_to_improve.${category}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
