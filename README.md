# northlab_wishlist

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/fehleques/northlab_wishlist)

## Hooks

The project exposes reusable React hooks for common browser preferences:

- `useTheme` handles color-scheme selection and persists the user's choice in `localStorage`.
- `usePrefersReducedMotion` reflects the user's reduced-motion setting so components can adapt animations.

Use these hooks instead of accessing `matchMedia` or `localStorage` directly to keep behavior consistent across the app.

```tsx
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion';
import useTheme from './hooks/useTheme';

const prefersReducedMotion = usePrefersReducedMotion();
const { theme, toggleTheme } = useTheme();
```

They automatically respond to system setting changes and persist user choices, so include them wherever components need to know about theme or motion preferences.

