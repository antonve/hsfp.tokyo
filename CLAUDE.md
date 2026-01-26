# HSFP.tokyo

Points calculator for Japan's Highly Skilled Foreign Professional (HSFP) visa.

## Commands

```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm test     # Run tests
pnpm fmt      # Format code
pnpm lint     # Run ESLint
```

## Workflow

**Always run `pnpm fmt` before finishing any changes.**

**Use `npx tsc --noEmit` to check for type errors** (faster and works offline, unlike `pnpm build` which requires network for Google Fonts).

## Reference

- [Architecture](docs/architecture.md) - URL state, matcher pattern, form config, i18n
- [Styling](docs/styling.md) - Theme colors, button classes
- [Adding Questions](docs/tasks/adding-questions.md)
- [Adding Visa Types](docs/tasks/adding-visa-types.md)
- [Modifying Points](docs/tasks/modifying-points.md)
