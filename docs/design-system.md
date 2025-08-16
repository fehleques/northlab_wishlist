# Design System

This project uses a small set of design tokens defined in `src/styles/tokens.css`. Tokens cover colors, spacing, and typography and are exposed as CSS variables.

Shadcn UI components are installed to provide accessible primitives. Each generated component is rewritten to use SCSS modules that reference the tokens instead of Tailwind utility classes.

## Tokens

- **Colors**: primary brand color and foreground/background values.
- **Spacing**: xs–lg scale used for padding and gaps.
- **Typography**: base family and size scale.

## Shadcn Integration

Shadcn's Button, Input, and Form components live in `src/components/ui`. Styles are authored with SCSS modules to map directly to the design tokens. Additional components can follow the same pattern.
