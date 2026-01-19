# Adding a New Form Question

## 1. Define the prompt

In the visa file (e.g., `src/lib/domain/visa.engineer.ts`):

```typescript
// In formConfig.sections[].prompts
{ id: 'new_question', type: 'choice', options: ['option1', 'option2'] }
```

## 2. Update the qualifications schema

In the same visa file:

```typescript
const EngineerQualificationsSchema = z.object({
  // ... existing fields
  newQuestion: z.enum(['option1', 'option2']).optional(),
})
```

## 3. Add translations

In `src/lib/i18n/messages/en.json`:

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

## 4. Add matching logic (if affects points)

```typescript
function matchNewQuestion(q: EngineerQualifications): MatchResult[] {
  if (q.newQuestion === 'option1') {
    return [{ criteria: 'new_criteria', points: 10 }]
  }
  return []
}
```

Add the matcher to the `matchers` array.

## Adding FAQ to a Prompt

1. Set `faqCount: n` on the prompt definition
2. Add translations: `visa_form.{visa}.sections.{section}.{prompt}.faq.0`, `.faq.1`, etc.

## Adding a New Section

1. Add section to `formConfig.sections` array
2. Add translations under `visa_form.{visa}.sections.{sectionId}`
