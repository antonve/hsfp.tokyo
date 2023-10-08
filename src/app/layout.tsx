import { Metadata } from 'next'
import cn from 'classnames'
import { cormorantGaramond, inter } from './fonts'

import './globals.css'

export const metadata: Metadata = {
  title: 'HSFP.tokyo',
  description:
    'Calculate if you are eligible for the Highly Skilled Foreign Professional visa in Japan!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'bg-stone-950 text-gray-50 font-sans',
          cormorantGaramond.variable,
          inter.variable,
        )}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </body>
    </html>
  )
}
