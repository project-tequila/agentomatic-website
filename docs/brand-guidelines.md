# agentomatic brand guidelines

> Last updated: 2026-09-03
> Status: Active
> Canonical site: https://www.agentomatic.in/
> Legal entity: Agentomatic Innovation Labs Pvt. Ltd.
> Footer credit: © agentomatic labs

Source of truth for marketing agents (Mark / Mahima / Mahira / Medha / Malhar) and any branded copy, ads, social, or creative. Filled from the live site and this repo — do not invent a second brand.

## Quick Reference

| Element | Value |
|---------|-------|
| Wordmark | `agentomatic` (always lowercase) |
| Product | ai frontdesk |
| Tagline | your ai front desk. |
| Promise | for your team — not instead of them. |
| Supporting line | routine calls handled — warm handoff when it matters. |
| Primary Color | #121418 (ink) |
| Secondary Color | #F5F2EB (cream) |
| Accent Color | #8CFFD2 (orb teal — glow only) |
| Chrome / labels | IBM Plex Mono |
| Display / body | DM Sans |
| Voice | Calm, direct, lowercase, operational |
| Canonical host | www.agentomatic.in (never .com as canonical) |

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

Loaded in `src/app/layout.tsx` as `--font-sans` (IBM Plex Mono) and `--font-marketing-dm` (DM Sans).

### Type Rules

| Element | Font | Weight | Case |
|---------|------|--------|------|
| Kickers / labels | IBM Plex Mono | 400 | lowercase |
| Display / H1 | DM Sans | 600–700 | lowercase |
| Body | DM Sans | 400 | lowercase |
| Chrome / nav | IBM Plex Mono | 500 | lowercase |

Exception: `/agents` product showcase may use Newsreader serif. Do not use that serif on default marketing chrome, ads, or social.

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
- Using agentomatic.com as the public URL

---

## 4. Voice & Tone

### We Are

- **Calm**: confident without hype
- **Direct**: short sentences, no filler
- **Operational**: speaks to front desks and ops teams
- **Human**: warm handoff, not replacement narrative

### Positioning (from the live site)

- Category: phone-ready ai front desk — not a chatbot pasted onto a phone line
- Audience: clinics, firms, and growth teams that still pick up the phone
- Job: answer instantly, qualify intent, book appointments, route warm leads, keep a clean summary
- Stance: for your team — not instead of them

### We Sound Like

- "your ai front desk."
- "for your team — not instead of them."
- "routine calls handled — warm handoff when it matters."
- "not a chatbot. a phone-ready agent that listens, answers, qualifies, schedules, and hands off with context."
- "write us here. we call back."

### We Don't Sound Like

- "Revolutionary AI-powered solution"
- "Sign Up Now!" (Title Case urgency)
- "Leverage synergies across your stack"
- "replace your receptionist" / "fire your front desk"
- Generic SaaS "unlock growth" / "10x your pipeline"

### Capitalization

- All UI copy lowercase unless proper noun (WhatsApp, CRM)
- Sentence case in long-form blog prose allowed
- Wordmark never title-cased

---

## 5. Messaging (homepage + inner pages)

### Primary message

your ai front desk.

### Supporting messages

| Message | Proof on site |
|---------|----------------|
| always on | available 24/7. nights, weekends, rush hour — someone's still picking up. |
| never busy | no busy tone. ever. three lines ringing? nobody hears a busy tone. |
| one thread | phone · whatsapp · email · calendar. one thread knows the whole story. |
| their language | 17+ languages. they call in their language. your desk answers like it belongs. |
| human when needed | human support, right when it's needed. hands off with context — no repeat-yourself moment. |
| keep the chair filled | smart reminders. nudge before they forget — fewer empty chairs. |
| ops view | your ops command center. one chat thread. your whole front desk. |

### Solutions page

voice agents that do the work after hello.

- inbound calls — answer instantly, capture intent, keep the caller moving
- lead qualification — ask the right questions, score fit, send warm context to sales
- appointments — book, reschedule, remind, confirm without a human queue
- conversation memory — every call becomes a clean summary your team can use

### About values

voice-first · human when it matters · operational memory · built for teams

### Meta description (SEO default)

streamline your front desk with ai — routine calls handled automatically, warm human transfer when it matters. phone, whatsapp, email, and calendar in one place.

---

## 6. CTA Hierarchy

| Level | Live label | Style |
|-------|------------|-------|
| Immersive / demo | Talk to Agent | chrome control (existing Title Case exception — do not invent more Title Case CTAs) |
| Contact primary | request voice demo | cream/ink pill |
| Chrome secondary | contact us | outline / text |
| Account | sign up · log in | outline / text |
| Story | try it live / call yourself. hear it answer in seconds. | cream/ink |

Do not add "Book a Demo", "Get Started Today", or "Learn More" as default labels.

---

## 7. Theme Modes

### Dark (immersive home, default shell)

- Background: ink `#121418`
- Text: cream-tinted white
- CTA: cream pill

### Light (marketing pages)

- Background: cream `#F5F2EB`
- Text: ink
- CTA: ink pill / cream text
- Cards: white surface on cream

---

## 8. Channels & claims you may use

Allowed because they are on agentomatic.in:

- phone, WhatsApp, email, calendar in one place
- 24/7 coverage, concurrent lines, multilingual (17+ languages)
- warm human handoff with context
- appointment booking, reminders, call summaries
- live voice demo / request a callback

Do not invent metrics (call volumes, conversion lifts, customer logos) unless they already appear on the site or in approved Notion/campaign docs.

---

## 9. Pricing language (if referenced)

Plans on /pricing: starter $299/month, growth $799/month, enterprise custom. Every plan includes live demo onboarding and script setup. Do not invent discounts or competitor price comparisons.
