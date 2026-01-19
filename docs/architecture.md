# Architecture

## URL-Encoded State

Qualifications are stored as base64-encoded JSON in query params (`?q=...`). No database needed - URLs are fully shareable.

- Calculator pages are client components
- Layouts are server components

## Matcher Pattern

Each visa type defines matchers that check qualifications and return points:

```typescript
// In visa.engineer.ts
const matchers: Matcher<EngineerQualifications>[] = [
  matchAge,
  matchAcademicBackground,
  // ...
]
```

Each matcher returns `MatchResult[]` with `{ criteria, points }`.

## Form Configuration

Prompts are defined declaratively in visa files (`src/lib/domain/visa.{type}.ts`):

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

## Translation Keys

All UI text uses keys from `src/lib/i18n/messages/en.json`:

```
visa_form.{visaType}.sections.{sectionId}.{promptId}.label
visa_form.{visaType}.sections.{sectionId}.{promptId}.options.{optionId}
```

For FAQs: `visa_form.{visa}.sections.{section}.{prompt}.faq.0`, `.faq.1`, etc.
