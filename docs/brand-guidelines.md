# agentomatic brand guidelines

> Last updated: 2026-06-29
> Status: Active

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #121418 |
| Secondary Color | #F5F2EB |
| Accent Color | #8CFFD2 |
| Primary Font | IBM Plex Mono |
| Body Font | DM Sans |
| Voice | Calm, direct, lowercase, operational |

---

## 1. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Ink | #121418 | rgb(18,20,24) | Dark backgrounds, primary text on light, CTA fill on light pages |
| Ink Deep | #0E1014 | rgb(14,16,20) | Gradients, depth |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Cream | #F5F2EB | rgb(245,242,235) | Primary CTA on dark, light page backgrounds, highlight text |
| Cream Muted | rgba(245,242,235,0.66) | — | Secondary text on dark |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Orb Teal | #8CFFD2 | rgb(140,255,210) | Immersive orb glow only — never marketing CTAs |
| Orb Blue | #9CC7FF | rgb(156,199,255) | Illustration accents only |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| Surface Dark | rgba(255,255,255,0.06) | Cards on dark |
| Border Dark | rgba(255,255,255,0.12) | Dividers on dark |
| Surface Light | #FFFFFF | Cards on light |
| Border Light | rgba(18,20,24,0.12) | Dividers on light |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #8CFFD2 | Confirmations (immersive context) |
| Error | #E87070 | Form errors, destructive hints |
| Warning | #F5C842 | Pending states |

### Accessibility

- Body text on ink: cream at 96% opacity (AAA)
- Body text on cream: ink at 96% opacity (AAA)
- Muted text: minimum 4.5:1 contrast on both themes
- Primary CTA: cream-on-ink or ink-on-cream only — no third-party blues

---

## 2. Typography

### Font Stack

```css
--font-heading: 'IBM Plex Mono', ui-monospace, monospace;
--font-body: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'IBM Plex Mono', ui-monospace, monospace;
```

### Type Rules

| Element | Font | Weight | Case |
|---------|------|--------|------|
| Kickers / labels | IBM Plex Mono | 400 | lowercase |
| Display / H1 | DM Sans | 600–700 | lowercase |
| Body | DM Sans | 400 | lowercase |
| Chrome / nav | IBM Plex Mono | 500 | lowercase |

---

## 3. Logo Usage

### Mark

- Dot-in-circle mark + wordmark `agentomatic`
- Always lowercase wordmark
- Minimum clear space: height of the dot mark on all sides

### Correct Usage

- Cream or white wordmark on ink backgrounds
- Ink wordmark on cream/light backgrounds
- Mark + wordmark together in chrome and footer

### Incorrect Usage

- Title Case or ALL CAPS wordmark
- Generic SaaS blue (#0369A1) for CTAs
- Orb teal as button fill on marketing pages
- Stretching or recoloring the mark

---

## 4. Voice & Tone

### We Are

- **Calm**: confident without hype
- **Direct**: short sentences, no filler
- **Operational**: speaks to front desks and ops teams
- **Human**: warm handoff, not replacement narrative

### We Sound Like

- "your ai front desk."
- "routine calls handled — warm handoff when it matters."
- "try it live"

### We Don't Sound Like

- "Revolutionary AI-powered solution"
- "Sign Up Now!" (Title Case urgency)
- "Leverage synergies across your stack"

### Capitalization

- All UI copy lowercase unless proper noun (WhatsApp, CRM)
- Sentence case in long-form blog prose allowed

---

## 5. CTA Hierarchy

| Level | Label | Style |
|-------|-------|-------|
| Primary | try it live | Cream fill / ink text (dark) · ink fill / cream text (light) |
| Secondary | sign up | Outline |
| Tertiary | log in | Text only |

---

## 6. Theme Modes

### Dark (immersive home, default shell)

- Background: ink `#121418`
- Text: cream-tinted white
- CTA: cream pill

### Light (marketing pages)

- Background: cream `#F5F2EB`
- Text: ink
- CTA: ink pill / cream text
- Cards: white surface on cream
