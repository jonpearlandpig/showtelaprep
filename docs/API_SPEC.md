# API Spec

Route handlers are scoped by authenticated user, workspace, and production.

## `GET /api/production-brief`

Returns the current production brief from FilmAKB.

Response:

- `production`
- `summary`
- `readiness`
- `risks`
- `decisions`
- `assumptions`
- `telawhy`

## `GET /api/search?q=...`

Searches FilmAKB. If the query is question-like, the client may route to Ask TELA.

Response:

- `query`
- `route`
- `results`
- `telawhy`

## `POST /api/ask-tela`

Answers operational questions only from FilmAKB.

Body:

- `question`
- `productionId`

Response:

- `answer`
- `confidence`
- `sources`
- `recommendedActions`
- `readinessImpact`
- `telawhy`

If evidence is missing, answer must be: "Not found in current FilmAKB."

## `POST /api/artifacts`

Creates an artifact intake record. Binary upload will use Supabase Storage signed upload URLs in a later step.

Body:

- `productionId`
- `filename`
- `artifactType`
- `contentType`

Response:

- `artifact`
- `nextEvent`
