import { Inter, Cormorant_Garamond } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const cormorantGaramond = Cormorant_Garamond({
  weight: '300',
  subsets: ['latin'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
})
