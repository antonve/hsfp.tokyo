import React from 'react'

// Jest runs in a CommonJS environment and can't easily consume next-intl's ESM
// bundles. For unit tests we don't need next-intl's runtime behavior; we just
// need stable hooks/components.

type Messages = Record<string, any>

const IntlContext = React.createContext<{
  locale: string
  messages: Messages
} | null>(null)

function getByPath(obj: any, path: string) {
  let cur = obj
  for (const part of path.split('.')) {
    if (cur == null) return undefined
    cur = cur[part]
  }
  return cur
}

function interpolate(template: string, values?: Record<string, any>) {
  if (!values) return template
  return template.replace(/\{(\w+)\}/g, (_m, name) => {
    const v = values[name]
    return v == null ? '' : String(v)
  })
}

export function useTranslations(namespace?: string) {
  const ctx = React.useContext(IntlContext)
  const t: any = (key: string, values?: Record<string, any>) => {
    const messages = ctx?.messages ?? {}
    const fullKey = namespace ? `${namespace}.${key}` : key
    const msg = getByPath(messages, fullKey)
    if (typeof msg === 'string') return interpolate(msg, values)
    return fullKey
  }

  t.raw = (key: string) => {
    const messages = ctx?.messages ?? {}
    const fullKey = namespace ? `${namespace}.${key}` : key
    const msg = getByPath(messages, fullKey)
    return typeof msg === 'string' ? msg : fullKey
  }

  return t
}

export function useLocale() {
  const ctx = React.useContext(IntlContext)
  return ctx?.locale ?? 'en'
}

export function NextIntlClientProvider({
  children,
  locale = 'en',
  messages = {},
}: {
  children: React.ReactNode
  locale?: string
  messages?: Messages
}) {
  return (
    <IntlContext.Provider value={{ locale, messages }}>
      {children}
    </IntlContext.Provider>
  )
}
