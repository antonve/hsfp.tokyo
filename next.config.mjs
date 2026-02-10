import createNextIntlPlugin from 'next-intl/plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Jest (via next/jest) also uses this list to decide which packages to
  // transform. next-intl/use-intl publish ESM bundles that need transpiling.
  transpilePackages: [
    'next-intl',
    'use-intl',
    '@formatjs/fast-memoize',
    'intl-messageformat',
    '@formatjs/ecma402-abstract',
    '@formatjs/icu-messageformat-parser',
    '@formatjs/icu-skeleton-parser',
    '@formatjs/intl-localematcher',
  ],
}

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/index.ts')

export default withNextIntl(nextConfig)
