import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

import messagesEn from '@lib/i18n/messages/en.json'

type Options = {
  locale?: string
  messages?: Record<string, any>
} & Omit<RenderOptions, 'wrapper'>

export function renderWithIntl(ui: React.ReactElement, opts: Options = {}) {
  const { locale = 'en', messages = messagesEn, ...renderOpts } = opts

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOpts })
}
