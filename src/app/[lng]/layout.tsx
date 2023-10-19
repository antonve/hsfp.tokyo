import { dir } from 'i18next'
import { languages } from '../i18n/settings'

import { Metadata } from 'next'
import cn from 'classnames'
import { cormorantGaramond, inter } from './fonts'

import './globals.css'

export const metadata: Metadata = {
  title: 'HSFP.tokyo',
  description:
    'Calculate if you are eligible for the Highly Skilled Foreign Professional visa in Japan!',
}



export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}




export default function RootLayout({
  children,
  params: {
    lng
  }
}: {
  children: React.ReactNode
  params: {
    lng: string
  }
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
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