# Dependency Upgrade Plan (Major Libraries)

Date: 2026-02-08

## Current (installed)

Top-level versions from `pnpm list --depth 0`:

- next: 16.1.6
- react / react-dom: 19.2.4
- tailwindcss: 4.1.18
- typescript: 5.9.3
- @headlessui/react: 2.2.9
- next-intl: 4.8.2

## Target “latest stable” (as of 2026-02-08)

- next: 16.1.6
  - Source: Release Alert (NPM feed) shows 16.1.6 as latest stable on 2026-01-27.
- react / react-dom: 19.2.4
  - Source: React GitHub releases list 19.2.4 as Latest (2026-01-26).
- tailwindcss: 4.1.18
  - Source: tailwindlabs/tailwindcss GitHub releases show v4.1.18 as Latest (2025-12-11).
- typescript: 5.9.3
  - Source: microsoft/TypeScript GitHub releases show 5.9.3 as Latest (2025-10-01).
- @headlessui/react: 2.2.9
  - Source: tailwindlabs/headlessui GitHub releases show @headlessui/react@v2.2.9 as Latest (2025-09-25).
- next-intl: 4.8.2
  - Source: amannn/next-intl GitHub releases show v4.8.2 as Latest (2026-02-02).

## Strategy

Big jumps are acceptable, but we’ll validate each Next.js major upgrade as “working” before moving on:

1. Baseline stabilization (done)
   - Ensure `pnpm lint`, `pnpm test`, `pnpm build` run non-interactively and are green.
2. Make versions deterministic (done)
   - Replace `latest` tags in `package.json` with explicit versions (TypeScript, PostCSS, Autoprefixer, @types/*, etc.).
3. Next.js major-by-major (done)
   - Upgraded Next 13 -> 14.2.35.
   - Upgraded Next 14 -> 15.5.12 (required updating App Router prop types: `params`/`searchParams` are typed as Promises in Next 15+).
   - Upgraded Next 15 -> 16.1.6 (migrated linting to ESLint flat config via `eslint.config.cjs`).
4. React major upgrade (done)
   - Upgraded React 18 -> 19.2.4 (and updated `@types/react*` + testing-library to versions compatible with React 19).
5. next-intl upgrade (done)
   - Upgraded 3.0.0-beta.19 -> 4.8.2 and migrated API usage (`getTranslator` -> `getTranslations`, `next-intl/link` -> local locale-aware Link wrapper).
6. Tailwind major upgrade (done)
   - Upgraded Tailwind 3 -> 4.1.18.
   - Updated PostCSS plugin (`tailwindcss` -> `@tailwindcss/postcss`) and CSS entry (`@tailwind ...` -> `@import "tailwindcss";`).
7. Cleanup (pending)
   - Remove deprecated/unused deps, re-run checks, commit.

## Verification gates (per step)

- `pnpm -s run lint`
- `pnpm -s run test`
- `pnpm -s run build`
