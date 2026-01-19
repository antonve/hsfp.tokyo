# Adding a New Visa Type

## 1. Create the visa file

Create `src/lib/domain/visa.{type}.ts` with:

- `formConfig` object defining sections and prompts
- `{Type}QualificationsSchema` Zod schema
- `calculatePoints()` function with matchers

## 2. Register the schema

Update `src/lib/domain/qualifications.ts` to include the new schema in the union.

## 3. Register the form config

Update `src/lib/domain/form.ts` `formConfigForVisa()` function.

## 4. Add translations

Add all form translations in `src/lib/i18n/messages/en.json` under `visa_form.{newType}`.

## 5. Add to home page

Add a visa card to the home page for the new type.
