# ShowTELA Prep Architecture

ShowTELA Prep is a mobile-first operational runtime for live production continuity.
It is built as a Next.js App Router application with a browser-local persistence layer.

## Runtime Model

- `src/lib/showtela.ts` defines operation state, derived state, pressure scoring, event types, and view-model helpers.
- Operations are rendered according to pressure, not manual sort order.
- Derived states include `WAITING_ON`, `BLOCKED_BY`, `NEEDS_REVIEW`, `STALE_72_HOURS`,
  `READY_FOR_APPROVAL`, and `UNRESOLVED_DEPENDENCY`.

## Persistence

- `src/hooks/use-showtela-store.ts` persists runtime state to browser `localStorage`.
- Storage key: `showtela.runtime.v1`.
- Supported executable actions:
  - add operation
  - verify operation
  - refresh continuity
  - escalate operation
  - transition waiting/active state
  - execute the top next action
  - reset seeded runtime state

## UI Structure

- `src/app/page.tsx` composes the mobile runtime shell and home feed.
- `src/components/mobile-runtime.tsx` provides the mobile app frame, header, and bottom navigation.
- `src/components/home-feed.tsx` renders the live status hero, update digest, TELAwhy summary,
  next action, team presence, operation creation form, and pressure-sorted feed.
- `src/components/operation-card.tsx` renders operational continuity cards with action controls.
- `src/components/tela-card.tsx` contains reusable TELA card primitives.
- `src/styles/tokens.css` is the design-token source for color, typography, spacing, radius, and motion.

## Current Boundary

This v1 is a working local operational app. Data persists across reloads in the same browser.
It is not yet a shared multi-user backend. The storage boundary is isolated so the next backend
step can replace `localStorage` with a database-backed API without rewriting the UI model.
