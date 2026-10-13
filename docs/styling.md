# Styling

## Theme System

The app uses Tailwind's standard `dark:` modifier for theming. Light mode is the default, and dark mode is activated by adding the `dark` class to the document root.

### Color Mapping Reference

When styling components, use explicit light and dark variants:

| Purpose | Light (default) | Dark (`dark:`) |
|---------|-----------------|----------------|
| Primary background | `bg-white` | `dark:bg-zinc-950` |
| Secondary background | `bg-zinc-100` | `dark:bg-zinc-900` |
| Tertiary background | `bg-zinc-200` | `dark:bg-zinc-800` |
| Accent background | `bg-zinc-200` | `dark:bg-zinc-600` |
| Primary text | `text-zinc-900` | `dark:text-gray-50` |
| Secondary text | `text-zinc-700` | `dark:text-zinc-300` |
| Muted text | `text-zinc-500` | `dark:text-zinc-400` |
| Subtle text | `text-zinc-600` | `dark:text-zinc-500` |
| Standard border | `border-zinc-300` | `dark:border-zinc-700` |
| Subtle border | `border-zinc-100` | `dark:border-zinc-900` |

### Status Colors

Green means only "you qualify". Use it for the verdict (progress bar, results preview footer, results banner) and nowhere else.

| Purpose | Light | Dark |
|---------|-------|------|
| Qualified badge background | `bg-emerald-100` | `dark:bg-emerald-700` |
| Qualified badge text | `text-emerald-800` | `dark:text-gray-50` |
| Error background | `bg-red-50` | `dark:bg-red-950/20` |
| Error border | `border-red-300` | `dark:border-red-800` |
| Error text | `text-red-700` | `dark:text-red-400` |

Every error shows an `ExclamationCircleIcon` next to its message, so errors are not identified by colour alone.

### Shadow with Ring Border

```tsx
className="shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800"
```

## Buttons

Use classes defined in `globals.css`:
- `.button` - Primary CTA button (white bg, dark text - fixed colors for both themes)
- `.button.secondary` - Secondary button (uses dark: modifiers for theme adaptation)

## Accent Color

- `accent` - Ink (`zinc-900` in light mode, `gray-50` in dark mode), defined in `globals.css`. Use it for selected states, focus rings and hover outlines: `ring-accent`, `outline-accent`, `border-accent`, `bg-accent text-accent-contrast`.
- Red (`red-500`) is the brand colour and the error colour. Use it for the logo, the landing chart and the `.kicker` heading rule, never on controls, so red inside a form always means an error.

## Breakpoints

- `md:` - 768px
- `lg:` - 1024px
