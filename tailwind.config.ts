import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import motion from 'tailwindcss-motion'

const config: Config = {
  darkMode: 'selector',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        serif: [
          'var(--font-cormorant-garamond)',
          ...defaultTheme.fontFamily.serif,
        ],
      },
    },
  },
  plugins: [motion],
}
export default config
