import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import motion from 'tailwindcss-motion'

const config: Config = {
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
      colors: {
        surface: {
          primary: 'rgb(var(--surface-primary) / <alpha-value>)',
          secondary: 'rgb(var(--surface-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--surface-tertiary) / <alpha-value>)',
          accent: 'rgb(var(--surface-accent) / <alpha-value>)',
        },
        content: {
          primary: 'rgb(var(--content-primary) / <alpha-value>)',
          secondary: 'rgb(var(--content-secondary) / <alpha-value>)',
          muted: 'rgb(var(--content-muted) / <alpha-value>)',
          subtle: 'rgb(var(--content-subtle) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border-color) / <alpha-value>)',
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [motion],
}
export default config
