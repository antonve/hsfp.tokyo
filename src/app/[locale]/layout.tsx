import { Metadata } from 'next'
import cn from 'classnames'
import { cormorantGaramond, inter } from '@app/fonts'

import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'

import '@app/globals.css'

export const metadata: Metadata = {
  title: 'HSFP.tokyo',
  description:
    'Calculate if you are eligible for the Highly Skilled Foreign Professional visa in Japan!',
}

// TODO: Re-enable static rendering once next-intl adds support for it.
// Ref. https://next-intl-docs.vercel.app/docs/getting-started/app-router-server-components#static-rendering
// This will generate the dynamic route segments for [locale]
// export async function generateStaticParams() {
//   return SUPPORTED_LOCALES.map(locale => ({ locale }))
// }

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: {
    locale: string
  }
}) {
  let messages
  try {
    messages = (await import(`../../lib/i18n/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <html lang={locale} dir="ltr">
      <body
        className={cn(
          'bg-stone-950 text-gray-50 font-sans',
          cormorantGaramond.variable,
          inter.variable,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
