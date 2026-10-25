# Dependency Upgrade Record (February 2026)

Original record date: 2026-02-08

This document records the February 2026 upgrade. It is not a current dependency inventory or an active cleanup checklist. See [`package.json`](../package.json) for declared versions and [`pnpm-lock.yaml`](../pnpm-lock.yaml) for resolved versions. Validation of subsequent upgrades belongs with the corresponding change and its CI evidence.

## Recorded versions

Top-level versions recorded from `pnpm list --depth 0` on 2026-02-08:

- next: 16.1.6
- react / react-dom: 19.2.4
- tailwindcss: 4.1.18
- typescript: 5.9.3
- @headlessui/react: 2.2.9
- next-intl: 4.8.2

## Recorded changes

The original record marked the following steps complete:

1. Baseline stabilization
   - Made `pnpm lint`, `pnpm test`, `pnpm build` run non-interactively and pass.
2. Version pinning
   - Replaced `latest` tags in `package.json` with explicit versions (TypeScript, PostCSS, Autoprefixer, @types/*, etc.).
3. Next.js major-by-major
   - Upgraded Next 13 -> 14.2.35.
   - Upgraded Next 14 -> 15.5.12 (required updating App Router prop types: `params`/`searchParams` are typed as Promises in Next 15+).
   - Upgraded Next 15 -> 16.1.6 (migrated linting to ESLint flat config via `eslint.config.cjs`).
4. React major upgrade
   - Upgraded React 18 -> 19.2.4 (and updated `@types/react*` + testing-library to versions compatible with React 19).
5. next-intl upgrade
   - Upgraded 3.0.0-beta.19 -> 4.8.2 and migrated API usage (`getTranslator` -> `getTranslations`, `next-intl/link` -> local locale-aware Link wrapper).
6. Tailwind major upgrade
   - Upgraded Tailwind 3 -> 4.1.18.
   - Updated PostCSS plugin (`tailwindcss` -> `@tailwindcss/postcss`) and CSS entry (`@tailwind ...` -> `@import "tailwindcss";`).

The original record left dependency cleanup unverified. That historical note does not establish whether cleanup is still needed or has since been completed.

## Recorded verification commands

These were the verification gates listed for each upgrade step, not evidence that the current revision passes:

- `pnpm -s run lint`
- `pnpm -s run test`
- `pnpm -s run build`
