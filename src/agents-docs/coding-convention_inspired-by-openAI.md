# AGENT.md

## Purpose

This document defines the principles, structure, and rules for building NorthLab’s frontend in a scalable, OpenAI-inspired way. It is a guide for both humans and AI agents (like Codex) to extend functionality, build new pages, and maintain quality at scale.

---

## Core Mindset

1. **Tokens First**  
   All design values (color, typography, spacing, shadows, radii) must be defined as CSS custom properties. Components should never hardcode raw hex or px values.

2. **Layered CSS**

   - **Base:** Reset + tokens
   - **Primitives:** Card, Container, Button, Input, etc.
   - **Components:** Composed elements built from primitives
   - **Pages:** Layout + composition only

3. **Composition Over Variants**  
   Keep primitives small and composable. Create page-level compositions instead of bloating a single component with too many props.

4. **Fluid Responsive Defaults**  
   Use `clamp()` for typography and spacing. Avoid writing breakpoints unless strictly needed.

5. **Visual Language**  
   Dark-first. Subtle contrast. Hairline borders. Glow accents for hero elements. This matches the OpenAI Codex aesthetic.

6. **Accessibility Constraints**

   - Enforce contrast ratios in tokens
   - Always include focus states
   - Motion reduces gracefully for users with prefers-reduced-motion

7. **File Responsibility**  
   Group files by purpose. Avoid cross-import tangles.

8. **SSR + Lightweight Hydration**  
   Next.js App Router is the default. Content should come from MDX or CMS to keep the system extensible.

---

## Implementation Rules

### Tokens (`src/styles/tokens.css`)

- Define all colors, spacing, type scales, shadows, and radii here.
- Example:

```css
:root {
  --bg: #0b0c10;
  --text: #e7e9ee;
  --accent: 210 100% 55%;
  --step-0: clamp(1rem, 0.95rem + 0.28vw, 1.2rem);
  --radius: 12px;
}
```
