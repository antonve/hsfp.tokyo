import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        progress: 'progress  0.5s',
      },
      keyframes: {
        progress: {
          '0%': { height: '0%' },
          '100%': { height: '100%' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        serif: [
          'var(--font-cormorant-garamond)',
          ...defaultTheme.fontFamily.serif,
        ],
      },
    },
  },
  plugins: [],
}
export default config
