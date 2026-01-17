# CLAUDE.md - HSFP.tokyo Project Guide

## Project Overview

HSFP.tokyo is a web-based points calculator for Japan's Highly Skilled Foreign Professional (HSFP) visa. Users answer questions about their qualifications and receive a points breakdown across three visa categories:

- **Engineer**: Advanced specialized/technical activities (fully implemented)
- **Researcher**: Advanced academic research activities
- **Business Manager**: Advanced business management activities

## Tech Stack

- **Next.js 13.5** with App Router
- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **next-intl** for i18n (currently EN only)
- **Zod** for schema validation
- **Jest** + Testing Library for tests
- **pnpm** as package manager (enforced)

## Commands

```bash
pnpm dev          # Development server (port 3000)
pnpm build        # Production build
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm fmt          # Format code with Prettier
pnpm fmt:check    # Check formatting
pnpm lint         # Run ESLint
```

## Directory Structure

```
src/
├── app/[locale]/                    # Next.js App Router pages
│   ├── page.tsx                     # Home - visa category selection
│   ├── layout.tsx                   # Root layout with i18n provider
│   └── calculator/[visa]/           # Calculator pages
│       ├── layout.tsx               # Calculator layout (sidebar, header)
│       ├── [section]/[prompt]/page.tsx  # Question pages
│       └── results/page.tsx         # Results breakdown
├── components/                      # React components
│   ├── ChoicePrompt.tsx            # Radio button selection
│   ├── NumberPrompt.tsx            # Number input
│   ├── BooleanPrompt.tsx           # Yes/No selection
│   ├── VisaForm*.tsx               # Form wrapper components
│   └── VisaFormNavigation.tsx      # Sidebar navigation
└── lib/
    ├── domain/                      # Business logic (core)
    │   ├── visa.engineer.ts         # Engineer visa config + matching
    │   ├── visa.researcher.ts       # Researcher visa config + matching
    │   ├── visa.businessmanager.ts  # Business Manager visa config
    │   ├── matching.ts              # Core point calculation algorithm
    │   ├── qualifications.ts        # Zod schemas for user inputs
    │   ├── form.ts                  # Form config types
    │   └── prompts.ts               # Prompt completion tracking
    ├── i18n/
    │   ├── index.ts                 # Locale config and message loading
    │   ├── middleware.ts            # i18n routing middleware
    │   └── messages/en.json         # English translations
    └── hooks.ts                     # React hooks
```

## Key Architecture Patterns

### 1. URL-Encoded State
Qualifications are stored as base64-encoded JSON in query params (`?q=...`). No database needed - URLs are fully shareable.

### 2. Matcher Pattern for Point Calculation
Each visa type defines matchers that check qualifications and return points:
```typescript
// In visa.engineer.ts
const matchers: Matcher<EngineerQualifications>[] = [
  matchAge,
  matchAcademicBackground,
  // ... more matchers
]
```

### 3. Form Configuration
Prompts defined declaratively in visa files:
```typescript
const formConfig: FormConfig = {
  sections: [
    {
      id: 'academic',
      prompts: [
        { id: 'degree', type: 'choice', options: [...] },
      ]
    }
  ]
}
```

### 4. Translation Key Convention
All UI text uses translation keys from `messages/en.json`:
```
visa_form.{visaType}.sections.{sectionId}.{promptId}.label
visa_form.{visaType}.sections.{sectionId}.{promptId}.options.{optionId}
```

## Common Tasks

### Adding a New Form Question

1. **Define the prompt** in the visa file (`src/lib/domain/visa.engineer.ts`):
   ```typescript
   // In formConfig.sections[].prompts
   { id: 'new_question', type: 'choice', options: ['option1', 'option2'] }
   ```

2. **Update the qualifications schema** in the same file:
   ```typescript
   const EngineerQualificationsSchema = z.object({
     // ... existing fields
     newQuestion: z.enum(['option1', 'option2']).optional(),
   })
   ```

3. **Add translations** in `src/lib/i18n/messages/en.json`:
   ```json
   "visa_form": {
     "engineer": {
       "sections": {
         "section_id": {
           "new_question": {
             "label": "Your question text",
             "options": {
               "option1": "First option",
               "option2": "Second option"
             }
           }
         }
       }
     }
   }
   ```

4. **Add matching logic** if the question affects points:
   ```typescript
   function matchNewQuestion(q: EngineerQualifications): MatchResult[] {
     if (q.newQuestion === 'option1') {
       return [{ criteria: 'new_criteria', points: 10 }]
     }
     return []
   }
   ```

### Modifying Point Calculations

Edit the matcher functions in `src/lib/domain/visa.{type}.ts`. Each matcher returns `MatchResult[]` with criteria and points.

### Adding a New Section

1. Add section to `formConfig.sections` array in the visa file
2. Add section translations under `visa_form.{visa}.sections.{sectionId}`

### Adding FAQ to a Prompt

1. Set `faqCount: n` on the prompt definition
2. Add translations: `visa_form.{visa}.sections.{section}.{prompt}.faq.0`, `.faq.1`, etc.

### Adding a New Visa Type

1. Create `src/lib/domain/visa.{type}.ts` with:
   - `formConfig` object
   - `{Type}QualificationsSchema` Zod schema
   - `calculatePoints()` function with matchers

2. Update `src/lib/domain/qualifications.ts` to include schema in union
3. Update `src/lib/domain/form.ts` `formConfigForVisa()` function
4. Add translations in `en.json`
5. Add visa card to home page

### Adding a New Component

Create in `src/components/`. Use:
- TypeScript interfaces for props
- Tailwind CSS for styling
- `classnames` for conditional classes
- `useTranslations()` for i18n

### Adding a New Page

Create `src/app/[locale]/your-path/page.tsx`. Access translations with:
```typescript
const t = useTranslations('namespace')
```

## Development Workflow

### Before Completing Changes

**ALWAYS run `pnpm fmt` before finishing any changes.** This ensures consistent code formatting across the codebase using Prettier.

```bash
pnpm fmt          # Format all code
pnpm fmt:check    # Verify formatting (useful in CI)
```

This should be done:
- Before committing code
- Before creating pull requests
- After making any code changes
- Before marking work as complete

## Path Aliases

- `@app/*` → `./src/app/*`
- `@components/*` → `./src/components/*`
- `@lib/*` → `./src/lib/*`

## Styling Conventions

- Dark theme: `bg-zinc-950`, `text-gray-50`
- Accent color: `emerald-400`
- Button classes: `.button`, `.button.outline` (defined in `globals.css`)
- Responsive breakpoints: `md:` (768px), `lg:` (1024px)

## Testing

Test files are co-located with source files (`*.spec.ts`). Run with `pnpm test`.

Key test files:
- `src/lib/domain/visa.engineer.spec.ts` - Engineer visa point calculations
- `src/lib/domain/form.spec.ts` - Form configuration logic
- `src/lib/domain/prompts.spec.ts` - Prompt completion tracking

## Important Files

| File | Purpose |
|------|---------|
| `src/lib/domain/visa.engineer.ts` | Engineer visa form config and point matching |
| `src/lib/domain/matching.ts` | Core matching algorithm |
| `src/lib/domain/qualifications.ts` | Zod schemas for all visa qualifications |
| `src/lib/i18n/messages/en.json` | All English translations |
| `src/app/[locale]/calculator/[visa]/[section]/[prompt]/page.tsx` | Question page component |
| `src/app/[locale]/calculator/[visa]/results/page.tsx` | Results page |

## Notes

- All form state lives in URL params - no server state needed
- Calculator pages are client components; layouts are server components
