# Database Schema

Status: Draft for Sprint 1 implementation.

All tables include `id uuid primary key`, `workspace_id uuid`, `production_id uuid` where relevant, `created_at timestamptz`, and `updated_at timestamptz`. Public tables must enable RLS. Authorization must not rely on user-editable metadata.

## Core Tenancy

- `workspaces`: organization boundary.
- `users`: profile records mapped to Supabase Auth users.
- `productions`: production records owned by workspaces.

## FilmAKB Tables

- `artifacts`: original file records, type, storage path, OCR status, metadata.
- `artifact_versions`: immutable versions of artifacts and derived text.
- `scenes`: scene number, heading, INT/EXT, DAY/NIGHT, pages, extracted dependencies.
- `characters`: canonical character names and appearance summaries.
- `locations`: canonical locations, addresses, permits, parking, power, status.
- `crew`: crew intelligence.
- `cast`: cast intelligence.
- `schedules`: prep and shoot planning rows.
- `risks`: risk, severity, owner, status, impact, mitigation.
- `decisions`: decision, owner, date, reason, impact.
- `assumptions`: assumption, verification status, related risks.
- `timeline_events`: visible production progression across prep, shoot, and wrap.
- `replay_events`: append-only operational black box.
- `relationships`: typed graph edges between FilmAKB entities.
- `telawhy`: lineage records linking answers and registry facts to evidence.
- `search_index`: denormalized production search entries.

## Required Extensions

- `pgcrypto` for UUID generation if needed.
- `vector` only when semantic search is added.

## RLS Model

Rows are scoped by `workspace_id`. Membership is stored in database tables controlled by server-side operations, not user-editable JWT metadata. Service-role operations are server-only and never exposed to browser code.
