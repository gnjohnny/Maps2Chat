# Memory — Lead Acquisition Pipeline & Operator Dashboard

Last updated: 2026-07-06

## What was built

- **Error Handling & UI Alerts**:
  - Implemented locally-managed submission errors in [ManualLeadForm.tsx](file:///C:/Users/Johnny/Agy_test/Maps2Chat/client/src/components/dashboard/ManualLeadForm.tsx) to catch and render validation/duplicate error payloads from the API server.
  - Added a general `error` banner to [Dashboard.tsx](file:///C:/Users/Johnny/Agy_test/Maps2Chat/client/src/pages/Dashboard.tsx) to display sync, contact, or archiving errors, automatically clearing on tab changes.
- **Google OAuth Strategy Fixes**:
  - Replaced the hardcoded `/login` path for Passport callback failure redirection in [authRoutes.ts](file:///C:/Users/Johnny/Agy_test/Maps2Chat/api/src/routes/authRoutes.ts) with the client domain configured via `process.env.CLIENT_URL` to avoid backend routing 404s.
  - Resolved redirect race condition in [App.tsx](file:///C:/Users/Johnny/Agy_test/Maps2Chat/client/src/App.tsx) by synchronously capturing and saving the JWT token in state initialization.
- **Database & Env Configuration**:
  - Added the missing `CLIENT_URL` token variable to [api/.env.example](file:///C:/Users/Johnny/Agy_test/Maps2Chat/api/.env.example).
  - Resolved the `ECONNREFUSED` connection issue by shifting the `dotenv/config` loading to the very top of [index.ts](file:///C:/Users/Johnny/Agy_test/Maps2Chat/api/src/index.ts) and [db.ts](file:///C:/Users/Johnny/Agy_test/Maps2Chat/api/src/db.ts) before any static ESM imports are evaluated.

## Decisions made

- Chose to let internal daemon scraper errors bubble up to HTTP API route controllers to avoid masking API key or database validation failures as "successful sweeps saving 0 leads".
- Cleaned up ad-hoc styling overrides on inputs and dialogs, aligning dialog rendering strictly with core CSS theme tokens for robust light/dark mode adaptability.
- Propagated mutation errors directly to parent dashboard and manual lead forms to provide operators with clear contextual feedback on why lead synchronization or creation failed.
- Wrote token to `localStorage` synchronously during state initialization in `AppRoutes` rather than asynchronously in a `useEffect` to ensure subsequent network queries have the Authorization header populated.
- Shifted `dotenv/config` to the earliest possible point in the module lifecycle to guarantee connection strings are resolved before the database pool executes.

## Problems solved

- Fixed potential memory/crash issues and hidden connection failures on manual scraping by ensuring error bubbles are caught by Express global handlers instead of swallowed inside the ingestion loop.
- Resolved backend 404 redirects when authentication callback failed.
- Resolved silent failures inside dashboard mutation operations and manual forms.
- Resolved redirect loops and query race conditions after Google OAuth redirection.
- Resolved database connection refusal error (`ECONNREFUSED`).

## Current state

- The client and API codebases build successfully with strict type-safety.
- All pipeline requirements (Kenya bounding coordinates, address filters, phone formatting, deduplication, daily quotas) and Operator Dashboard functions are fully implemented and integrated.
- Visual alerts and validation error displays are configured to handle API/network failure contingencies.

## Next session starts with

- Deploying backend/frontend configurations to live hostings and completing credential validations using real production Google Places and OAuth 2.0 Client Keys.

## Open questions

- None.
