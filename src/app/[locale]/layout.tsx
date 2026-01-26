import { Metadata } from 'next'
import cn from 'classnames'
import { cormorantGaramond, inter } from '@app/fonts'

import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { SiteFooter } from '@components/SiteFooter'
import { SiteHeader } from '@components/SiteHeader'
import { ThemeProvider } from '@lib/ThemeContext'

import '@app/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hsfp.tokyo'),
  title: 'HSFP.tokyo',
  description:
    'Calculate if you are eligible for the Highly Skilled Foreign Professional visa in Japan!',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'HSFP.tokyo',
    description:
      'Calculate if you are eligible for the Highly Skilled Foreign Professional visa in Japan!',
    type: 'website',
    siteName: 'HSFP.tokyo',
  },
  twitter: {
    card: 'summary_large_image',
  },
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
          'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-gray-50 font-sans',
          cormorantGaramond.variable,
          inter.variable,
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
