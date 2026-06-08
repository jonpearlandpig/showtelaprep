# ShowTELA / TELAOne Runtime Guidance

Read `AGENTS.md` first for Next.js version guidance. This repo uses Next.js 16 App Router,
TypeScript, Tailwind CSS v4, and Framer Motion.

## Design Source Of Truth

- Use `src/styles/tokens.css` for color, typography, spacing, radius, and motion values.
- Do not introduce Tailwind default color palettes for branded UI surfaces.
- Use `next/font/google` in `src/app/layout.tsx` for Playfair Display, DM Sans, and DM Mono.
- Components should reference token values through CSS custom properties.

## Runtime Surface Rules

- ShowTELA is a mobile-first operational awareness runtime, not a generic SaaS dashboard.
- Prioritize continuity, pressure visibility, provenance, authority context, and calm scanability.
- Home is the primary runtime surface: live status, updates, TELAwhy summary, next action, team presence, and operational feed.
- Bottom navigation has five tabs: Home, Play, Messages, Calendar, Profile.

## Visual Rules

- Base surface: `var(--color-void)`.
- Card surface: `var(--color-navy)`.
- Primary accent: `var(--color-gold)`.
- Text: `var(--color-cream)` and `var(--color-cream-muted)`.
- Status colors: green, amber, red, blue, and purple from tokens only.
- Display text uses `var(--font-display)`.
- UI/body text uses `var(--font-body)`.
- Metadata/timestamps use `var(--font-mono)`.
- Minimum tap target is `var(--touch-min)`.
- Bottom nav is fixed and safe-area aware.

## Motion

- Use restrained Framer Motion fade-up entry.
- No looping decoration, bounce, spring theatrics, or engagement-driven motion.
- Motion should clarify state arrival, not create urgency.

## Prohibited Patterns

- No white SaaS dashboard surfaces for the runtime UI.
- No generic stat grids as the primary experience.
- No purple gradient backgrounds.
- No decorative orbs or bokeh.
- No noisy notification patterns detached from governed state.
