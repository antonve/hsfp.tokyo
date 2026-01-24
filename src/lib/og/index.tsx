/**
 * Open Graph Image Utilities
 *
 * This module provides shared utilities for generating OG images across the site.
 *
 * ## OG Image Implementation Approaches
 *
 * We use two approaches for OG images depending on requirements:
 *
 * ### 1. opengraph-image.tsx (Convention-based)
 * Used for static or params-only OG images. Next.js automatically handles
 * routing and caching. Examples:
 * - `/[locale]/opengraph-image.tsx` - Fallback OG image
 * - `/[locale]/calculator/[visa]/opengraph-image.tsx` - Visa intro pages
 *
 * ### 2. opengraph-image/route.tsx (Route Handler)
 * Used when we need access to URL search parameters (`?points=75`).
 * In Next.js 13, the opengraph-image.tsx convention does NOT pass
 * searchParams to the Image function - only route params are available.
 *
 * To access searchParams, we use a route handler where we can read
 * `request.nextUrl.searchParams` from the NextRequest object. Examples:
 * - `/[locale]/calculator/[visa]/results/opengraph-image/route.tsx`
 * - `/[locale]/calculator/[visa]/[section]/[prompt]/opengraph-image/route.tsx`
 *
 * The page.tsx files construct OG URLs with calculated values:
 * `/en/calculator/engineer/results/opengraph-image?points=75`
 *
 * This pattern allows dynamic OG images that reflect the user's current
 * progress and results without encoding the full qualification state.
 */

import { VisaType } from '@lib/domain'
import { getTranslator } from 'next-intl/server'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export const colors = {
  background: '#09090b', // zinc-950
  text: '#fafafa', // gray-50
  muted: '#a1a1aa', // zinc-400
  accent: '#34d399', // emerald-400
  warning: '#fbbf24', // amber-400
  logoRed: '#ef4444', // red-500
  logoDot: 'rgba(255,255,255,0.4)',
  progressBarBg: '#27272a', // zinc-800
}

// Valid visa slug values
const VISA_SLUGS = ['engineer', 'researcher', 'business-manager'] as const
type VisaSlug = (typeof VISA_SLUGS)[number]

function isValidVisaSlug(slug: string): slug is VisaSlug {
  return VISA_SLUGS.includes(slug as VisaSlug)
}

// Shared logo component for OG images
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        fontSize: `${size}px`,
        fontWeight: 700,
      }}
    >
      <span style={{ display: 'flex', color: colors.logoRed }}>HSFP</span>
      <span style={{ display: 'flex', color: colors.logoDot }}>.</span>
      <span style={{ display: 'flex', color: colors.text }}>tokyo</span>
    </div>
  )
}

// Get translator for OG namespace
export async function getOGTranslator(locale: string) {
  return getTranslator(locale, 'og')
}

// Get visa type label from translations
export async function getVisaTypeLabel(
  locale: string,
  slug: string,
): Promise<string> {
  if (!isValidVisaSlug(slug)) {
    return 'Visa'
  }
  const t = await getTranslator(locale, 'og.visa_types')
  return t(slug)
}

// Parse and clamp integer from search params
export function parseIntParam(
  value: string | null,
  min = 0,
  max?: number,
): number {
  const parsed = parseInt(value || '0', 10)
  if (Number.isNaN(parsed)) return min
  const clamped = Math.max(min, parsed)
  return max !== undefined ? Math.min(max, clamped) : clamped
}

export function getVisaTypeFromSlug(slug: string): VisaType | null {
  switch (slug) {
    case 'engineer':
      return VisaType.Engineer
    case 'researcher':
      return VisaType.Researcher
    case 'business-manager':
      return VisaType.BusinessManager
    default:
      return null
  }
}
