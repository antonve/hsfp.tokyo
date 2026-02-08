# Dependency Upgrade Plan (Major Libraries)

Date: 2026-02-08

## Current (installed)

Top-level versions from `pnpm list --depth 0`:

- next: 13.5.11
- react / react-dom: 18.3.1
- tailwindcss: 3.4.19
- typescript: 5.9.3
- @headlessui/react: 2.2.9
- next-intl: 3.0.0-beta.19

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
2. Make versions deterministic
   - Replace `latest` tags in `package.json` with explicit versions (TypeScript, PostCSS, Autoprefixer, @types/*, etc.).
3. Next.js major-by-major
   - Upgrade Next 13 -> 14 (latest 14.x), run `lint/test/build`, commit.
   - Upgrade Next 14 -> 15 (latest 15.x), run `lint/test/build`, commit.
   - Upgrade Next 15 -> 16.1.6, run `lint/test/build`, commit.
4. React major upgrade
   - Upgrade React 18 -> 19.2.4 (and align `@types/react*`), run `lint/test/build`, commit.
   - If Next 16 requires React 19 earlier, we’ll move this step earlier.
5. next-intl upgrade
   - Upgrade 3.0.0-beta.19 -> 4.8.2, update config/plugin usage as needed, run checks, commit.
6. Tailwind major upgrade
   - Upgrade Tailwind 3 -> 4.1.18, update config/CSS as needed, run checks, commit.
7. Cleanup
   - Remove deprecated/unused deps, re-run checks, commit.

## Verification gates (per step)

- `pnpm -s run lint`
- `pnpm -s run test`
- `pnpm -s run build`

