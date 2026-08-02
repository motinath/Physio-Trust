# PhysioTrust Design System & Aesthetic Specification

## 1. Design Aesthetics
PhysioTrust adheres to a **Minimal Nothing Tech OS Dark/Light Mode Aesthetic**:
- High-contrast pure black (`#000000`) and zinc dark gray (`#09090b` / `#18181b`) background.
- Crisp white typography (`#ffffff`), secondary muted zinc (`#a1a1aa`), and high-visibility status indicators.
- Crisp borders (`1px solid #27272a`), subtle micro-animations, and responsive layouts.

## 2. Color Palette Tokens

```css
:root[data-theme="dark"] {
  --bg-primary: #000000;
  --bg-panel: #09090b;
  --border-color: #27272a;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent-color: #ffffff;
  --status-error: #ef4444;
}

:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-panel: #f4f4f5;
  --border-color: #e4e4e7;
  --text-primary: #09090b;
  --text-secondary: #52525b;
  --text-muted: #71717a;
  --accent-color: #09090b;
  --status-error: #dc2626;
}
```
