# Styling

## Theme System

The app uses CSS variables for theming, defined in `globals.css`. Use semantic Tailwind classes that reference these variables:

### Surface Colors (backgrounds)
- `bg-surface-primary` - Main background (zinc-950 dark / white light)
- `bg-surface-secondary` - Secondary background (zinc-900 dark / zinc-100 light)
- `bg-surface-tertiary` - Tertiary background (zinc-800 dark / zinc-200 light)
- `bg-surface-accent` - Accent surfaces (zinc-600 dark / zinc-200 light)

### Content Colors (text)
- `text-content-primary` - Primary text (gray-50 dark / zinc-900 light)
- `text-content-secondary` - Secondary text (zinc-300 dark / zinc-700 light)
- `text-content-muted` - Muted text (zinc-400 dark / zinc-500 light)
- `text-content-subtle` - Subtle text (zinc-500 dark / zinc-600 light)

### Border Colors
- `border-border` - Standard borders (zinc-700 dark / zinc-300 light)
- `border-border-subtle` - Subtle borders (zinc-900 dark / zinc-100 light)

## Rules

**Never create `.light-theme` class overrides.** The goal is for all styling to work automatically via CSS variables. If something doesn't look right in one theme, adjust the CSS variable values in `globals.css` or use a different semantic class.

## Buttons

Use classes defined in `globals.css`:
- `.button` - Primary CTA button (light bg, dark text - fixed colors for both themes)
- `.button.secondary` - Secondary button (uses semantic surface colors)

## Accent Color

- `emerald-400` - Used for interactive states, focus rings, and highlights

## Breakpoints

- `md:` - 768px
- `lg:` - 1024px
