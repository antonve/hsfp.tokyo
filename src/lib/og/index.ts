import { VisaType } from '@lib/domain'

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export const colors = {
  background: '#09090b', // zinc-950
  text: '#fafafa', // gray-50
  muted: '#a1a1aa', // zinc-400
  accent: '#34d399', // emerald-400
  warning: '#fbbf24', // amber-400
}

export const visaTypeLabels: Record<string, string> = {
  [VisaType.Engineer]: 'Engineering',
  [VisaType.Researcher]: 'Research',
  [VisaType.BusinessManager]: 'Business Management',
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
