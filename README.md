# showtela

Prep to Wrap.

ShowTELA is a continuity-native operational runtime surface for touring, venues,
staffing, logistics, deployment coordination, and live production execution.

## Local development

```bash
npm run dev
```

Open http://localhost:3000.

## Runtime surface

The first screen implements:

- operational feed reprioritized by derived pressure state
- continuity cards with owner, dependency, authority, relationship, and provenance context
- derived operational states: `WAITING_ON`, `BLOCKED_BY`, `NEEDS_REVIEW`, `STALE_72_HOURS`,
  `READY_FOR_APPROVAL`, and `UNRESOLVED_DEPENDENCY`
- restrained notification examples tied to state transitions, escalation, verification, and stale pressure
- mobile-first ShowTELA runtime shell with TELAOne design tokens, live-status hero,
  update digest, TELAwhy summary, next action, team presence, and bottom navigation
- browser-persisted runtime state with executable actions for adding, verifying, refreshing,
  escalating, and transitioning operations

## Persistence model

This v1 stores operational state in browser `localStorage` under `showtela.runtime.v1`.
It is durable across reloads in the same browser and designed so a server database can
replace the storage layer later.
