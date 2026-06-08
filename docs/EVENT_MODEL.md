# Event Model

ShowTELA Prep is event driven. Registries describe current truth. Timeline and replay events explain how truth changed.

## Timeline Events

Human-readable production progression:

- artifact_uploaded
- ocr_completed
- extraction_completed
- registry_updated
- risk_created
- decision_recorded
- assumption_created
- brief_updated
- search_index_updated
- ask_tela_answered

## Replay Events

Append-only operational black box:

- who acted
- when it happened
- what changed
- why it changed
- affected FilmAKB entities
- source event
- TELAwhy record

Replay events are never edited in place. Corrections are new events.

## Cache Invalidation

Any event that changes FilmAKB invalidates:

- production brief cache
- search cache for affected terms
- Ask TELA cache for affected production
- timeline aggregate cache
