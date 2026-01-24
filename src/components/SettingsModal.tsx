'use client'

import { Fragment, useState, useCallback } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
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
  const router = useRouter()
  const pathname = usePathname()
  const [clearConfirmation, setClearConfirmation] = useState(false)

  const handleLanguageChange = useCallback(
    (newLocale: string) => {
      // Remove current locale prefix from pathname if present
      const pathWithoutLocale =
        pathname.replace(/^\/(en|ja|zh-CN|zh-TW)/, '') || '/'
      const newPath =
        newLocale === 'en'
          ? pathWithoutLocale
          : `/${newLocale}${pathWithoutLocale}`
      router.push(newPath)
    },
    [router, pathname],
  )

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-zinc-900 border border-zinc-700 p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-zinc-100">
                    {t('title')}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Language Selector */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300">
                      {t('language')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                            locale === lang.code
                              ? 'bg-zinc-800 border-emerald-500 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                              : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600'
                          }`}
                        >
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300">
                      {t('appearance')}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'dark'
                            ? 'bg-zinc-800 border-emerald-500 text-zinc-100'
                            : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <MoonIcon className="w-5 h-5" />
                        <span>{t('dark')}</span>
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                          theme === 'light'
                            ? 'bg-zinc-100 border-emerald-500 text-zinc-900'
                            : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <SunIcon className="w-5 h-5" />
                        <span>{t('light')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Clear Data */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-zinc-300">
                      {t('data')}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {t('clear_description')}
                    </p>
                    <button
                      onClick={handleClearData}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        clearConfirmation
                          ? 'bg-red-900/50 border-red-500 text-red-200 hover:bg-red-900/70'
                          : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-600'
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
