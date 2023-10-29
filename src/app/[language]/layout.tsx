import { dir } from 'i18next'
import { Metadata } from 'next'
import cn from 'classnames'
import { cormorantGaramond, inter } from '@app/fonts'
import { supportedLanguages } from '@app/i18n'

import '@app/globals.css'

export const metadata: Metadata = {
  title: 'HSFP.tokyo',
  description:
    'Calculate if you are eligible for the Highly Skilled Foreign Professional visa in Japan!',
}

// This will generate the dynamic route segments for [language]
export async function generateStaticParams() {
  return supportedLanguages.map(language => ({ language }))
}

export default function RootLayout({
  children,
  params: { language },
}: {
  children: React.ReactNode
  params: {
    language: string
  }
}) {
  return (
    <html lang={language} dir={dir(language)}>
      <body
        className={cn(
          'bg-stone-950 text-gray-50 font-sans',
          cormorantGaramond.variable,
          inter.variable,
        )}
      >
        <div className="max-w-7xl mx-auto p-2">{children}</div>
      </body>
    </html>
  )
}
