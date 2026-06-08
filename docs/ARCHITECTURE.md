# ShowTELA Prep Architecture

Status: Active

ShowTELA Prep is an operational intelligence environment for turning script artifacts into production knowledge. FilmAKB is the authority layer. Product features read from FilmAKB, explain through TELAwhy, and record replayable events.

## Principles

- FilmAKB is authoritative. If data is not sourced from FilmAKB, the product must say: "Not found in current FilmAKB."
- Every answer includes TELAwhy: sources, evidence, relationships, and last updated state.
- Artifacts enter first. Registries, search, briefs, risks, and replay derive from uploaded artifacts and subsequent events.
- The system is multi-tenant by workspace and production. Midian is sample data only.
- Users should feel like they are browsing a production, not managing a database.

## Runtime Shape

- Frontend: Next.js App Router, TypeScript, Tailwind, shadcn-compatible component primitives.
- Backend: App Router route handlers, service layer, event-driven processors.
- Database: Supabase PostgreSQL with RLS.
- Storage: Supabase Storage for originals, OCR derivatives, photos, and versioned artifacts.
- Cache: Redis for production briefs, search results, Ask TELA responses, and timeline aggregates.
- Auth: Supabase Auth.
- AI: Provider abstraction behind FilmAKB guardrails. Model providers cannot bypass source requirements.

## Application Layers

1. Experience layer: Home, Search, Ask TELA, Production, Messages, Profile, plus detail surfaces.
2. Route handlers: validate requests, identify workspace/production scope, call services.
3. Service layer: artifact intake, registry updates, search, Ask TELA, TELAwhy, replay, brief generation.
4. FilmAKB data layer: Supabase tables, storage objects, relationships, replay events.
5. Processing layer: OCR, extraction, entity creation, risk/decision/assumption inference, search indexing.

## Event Flow

Artifact Upload -> Storage -> OCR -> Extraction -> Entity Creation -> Registry Updates -> Timeline Event Creation -> TELAwhy Generation -> Production Brief Update -> Search Index Update -> Ask TELA Availability.

## Scale Targets

- 100 productions
- 1,000 users
- 10,000 artifacts
- 1,000,000 timeline events

Design choices must preserve tenant boundaries, append-only operational history, explainability, and cache invalidation on FilmAKB changes.
