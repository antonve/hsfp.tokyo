'use client'

import { Fragment, useState, useCallback } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useSearchParams } from 'next/navigation'
import { Link } from '@lib/i18n/navigation'
import { useTheme } from '@lib/ThemeContext'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'zh-CN', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
] as const

const STORAGE_KEY_PREFIX = 'hsfp-evidence'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const t = useTranslations('settings')
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [clearConfirmation, setClearConfirmation] = useState(false)

  // Get path without locale prefix for language switching, preserving query string
  const pathWithoutLocale =
    pathname.replace(/^\/(en|ja|zh-CN|zh-TW)/, '') || '/'
  const search = searchParams.toString()
  const hrefWithQuery = search
    ? `${pathWithoutLocale}?${search}`
    : pathWithoutLocale

  const handleClearData = useCallback(() => {
    if (!clearConfirmation) {
      setClearConfirmation(true)
      return
    }

    // Clear all evidence checklist data from localStorage
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch {
      // Ignore localStorage errors
    }

    setClearConfirmation(false)
    onClose()
  }, [clearConfirmation, onClose])

  const handleClose = useCallback(() => {
    setClearConfirmation(false)
    onClose()
  }, [onClose])

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-zinc-900 dark:text-gray-50">
                    {t('title')}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-gray-50 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Language Selector */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {t('language')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {LANGUAGES.map(lang => (
                        <Link
                          key={lang.code}
                          href={hrefWithQuery}
                          locale={lang.code}
                          onClick={onClose}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors no-underline ${
                            locale === lang.code
                              ? 'bg-zinc-200 dark:bg-zinc-800 border-emerald-500 text-zinc-900 dark:text-gray-50'
                              : 'bg-zinc-200/50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-500 dark:hover:border-zinc-400'
                          }`}
                        >
                          <span>{lang.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {t('appearance')}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'bg-zinc-200 dark:bg-zinc-800 border-emerald-500 text-zinc-900 dark:text-gray-50'
                            : 'bg-zinc-200/50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-500 dark:hover:border-zinc-400'
                        }`}
                      >
                        <MoonIcon className="w-5 h-5" />
                        <span>{t('dark')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-zinc-200 dark:bg-zinc-800 border-emerald-500 text-zinc-900 dark:text-gray-50'
                            : 'bg-zinc-200/50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-500 dark:hover:border-zinc-400'
                        }`}
                      >
                        <SunIcon className="w-5 h-5" />
                        <span>{t('light')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Clear Data */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {t('data')}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {t('clear_description')}
                    </p>
                    <button
                      type="button"
                      onClick={handleClearData}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        clearConfirmation
                          ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/70'
                          : 'bg-zinc-200/50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-400'
                      }`}
                    >
                      {clearConfirmation ? t('clear_confirm') : t('clear_data')}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
