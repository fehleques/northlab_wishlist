# northlab_wishlist

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/fehleques/northlab_wishlist)

## Hooks

The project exposes reusable React hooks for common browser preferences:

- `usePrefersReducedMotion` reflects the user's reduced-motion setting so components can adapt animations.

Use this hook instead of accessing `matchMedia` directly to keep behavior consistent across the app.

```tsx
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';

const prefersReducedMotion = usePrefersReducedMotion();
```

It automatically responds to system setting changes, so include it wherever components need to know about motion preferences.

## Styling guidelines

All spacing, color, and typography values should come from the design tokens defined in [`src/styles/globals.scss`](src/styles/globals.scss). Use the CSS variables (e.g. `var(--spacing-2)`) or combine them with `calc()` instead of hard-coded literals. A Stylelint rule checks for non-token values—run `npm run lint` before committing to verify compliance.

