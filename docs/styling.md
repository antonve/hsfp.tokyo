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

| Purpose | Light | Dark |
|---------|-------|------|
| Success background | `bg-emerald-50` | `dark:bg-emerald-900/20` |
| Success border | `border-emerald-400` | `dark:border-emerald-600` |
| Success badge background | `bg-emerald-100` | `dark:bg-emerald-700` |
| Success badge text | `text-emerald-800` | `dark:text-gray-50` |
| Error background | `bg-red-50` | `dark:bg-red-950/20` |
| Error border | `border-red-300` | `dark:border-red-800` |
| Error text | `text-red-600` | `dark:text-red-400` |

### Accent Subtle (icon circles)

```tsx
className="bg-emerald-400/15 dark:bg-emerald-400/10"
```

### Gradient Backgrounds

```tsx
className="bg-gradient-to-r from-emerald-200/40 to-zinc-100 dark:from-emerald-900/30 dark:to-zinc-900"
```

### Shadow with Ring Border

```tsx
className="shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-800"
```

## Buttons

Use classes defined in `globals.css`:
- `.button` - Primary CTA button (white bg, dark text - fixed colors for both themes)
- `.button.secondary` - Secondary button (uses dark: modifiers for theme adaptation)

## Accent Color

- `emerald-400` - Used for interactive states, focus rings, and highlights (fixed color, doesn't change with theme)

## Breakpoints

- `md:` - 768px
- `lg:` - 1024px
