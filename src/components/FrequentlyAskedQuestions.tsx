import { useTranslations } from 'next-intl'
import { useState } from 'react'
import classNames from 'classnames'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'

export function FrequentlyAskedQuestions({
  count,
  translationPrefix,
}: {
  count: number
  translationPrefix: string
}) {
  const t = useTranslations(translationPrefix)
  const [toggled, setToggled] = useState(0)

  if (count <= 0) {
    return null
  }

  function toggle(i: number) {
    const newToggled = toggled ^ (1 << i)
    console.log('new toggle value', newToggled)
    setToggled(newToggled)
  }

  function isToggled(i: number) {
    const mask = 1 << i
    return (toggled & mask) != 0
  }

  return (
    <div className="mt-10">
      <h2 className="font-semibold text-lg mb-4">{t('faq_heading')}</h2>
      <ol className="space-y-4">
        {Array.from(Array(count).keys()).map((_, i) => (
          <li key={i} className="rounded bg-zinc-900 px-4 py-2">
            <h3
              className="font-semibold cursor-pointer flex items-center justify-between"
              onClick={() => {
                console.log('toggling', i)
                toggle(i)
              }}
            >
              {t(`faq.q${i}`)}
              {isToggled(i) ? (
                <MinusIcon className="h-5 w-5 ml-2" />
              ) : (
                <PlusIcon className="h-5 w-5 ml-2" />
              )}
            </h3>
            <div
              className={classNames('faq-answer text-sm mt-2', {
                hidden: !isToggled(i),
              })}
              dangerouslySetInnerHTML={{ __html: t.raw(`faq.a${i}`) }}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
