# Build Plan - Maps2Chat

Following the **UI-first development principle**, the interface, layout, and visual interactions must be designed and verified with mock data before we deploy database schemas or write complex ingestion routines.

```
Step 1: Frontend UI Setup (Tailwind, shadcn, mock data)
                │
                ▼
Step 2: Frontend Navigation & Client-side State (React Router, TanStack Query mock clients)
                │
                ▼
Step 3: Database & ORM Initialization (Neon PostgreSQL & Prisma Schema)
                │
                ▼
Step 4: API Endpoint Implementation (Express controllers)
                │
                ▼
Step 5: Google OAuth Integration (Passport session config)
                │
                ▼
Step 6: Daemon Ingestion Development (Google Places API scraper + Cron job scheduler)
                │
                ▼
Step 7: Verification & Polishing
```

---

## Step 1: Frontend UI Setup

### 1.1 Boilerplate Setup
- Create React TypeScript project in `client/`.
- Configure Tailwind CSS with Custom CSS Variables and typography scales.
- Install shadcn/ui components (Card, Button, Dialog, Form, Input, Badge, DropdownMenu).

### 1.2 Layout & Themes
- Implement CSS variables for light/dark mode inside `client/src/index.css` using the Emerald accent.
- Create `client/src/components/theme-provider.tsx` using shadcn rules.
- Build main dashboard sidebar with responsive navigation links.

### 1.3 Lead View Cards
- Create mock leads dataset representing `PENDING`, `CONTACTED`, and `ARCHIVED` status.
- Build standard `client/src/components/lead-card.tsx` to render name, address, E.164 phone number, fetched timestamp, and action buttons.
- Create `Pending Queue` (showing primary WhatsApp trigger link), `Contacted Ledger` (read-only table with contacted date), and `Archived Vault` views.

---

## Step 2: Frontend Routing & Client-side State

### 2.1 Route Management
- Install `react-router-dom` in `client/`.
- Setup Router boundaries:
  - `/login`: Static card view with Google Login button.
  - `/`: Main dashboard rendering selected layout based on url params or state.

### 2.2 Client State Mock Wiring
- Set up TanStack React Query (`@tanstack/react-query`) context.
- Create mockup hooks for fetching leads and status updates:
  - `useFetchLeads`: returns static array filters.
  - `useContactLead`: local state patch simulating silent state transition and queue extraction.

---

## Step 3: Database & ORM Initialization

### 3.1 Prisma Setup
- Install `@prisma/client` and `prisma` dev dependency inside `api/`.
- Run `npx prisma init` in `api/`.
- Set up `DATABASE_URL` in `api/.env`.

### 3.2 Model Creation
- Write schema definitions inside `api/prisma/schema.prisma` for `Lead` and `LeadStatus`.
- Execute migration command:
  ```bash
  npx prisma migrate dev --name init_lead_schema
  ```

---

## Step 4: API Endpoint Implementation

### 4.1 REST Express Base Setup
- Install dependencies: `express`, `cors`, `dotenv`, `@prisma/client`, `zod`.
- Configure basic Express typescript server at `api/src/index.ts`.

### 4.2 API Controllers
- Implement REST API routes:
  - `GET /api/leads`: returns leads matching query parameters. Filter by status (`PENDING`, `CONTACTED`, `ARCHIVED`).
  - `PATCH /api/leads/:id/contact`: updates lead status to `CONTACTED` and sets `contactedAt = new Date()`.
  - `PATCH /api/leads/:id/archive`: updates status to `ARCHIVED`.

---

## Step 5: Google OAuth 2.0 Integration

### 5.1 OAuth Backend
- Setup Passport.js with Google Strategy (`passport-google-oauth20`).
- Create routes:
  - `GET /api/auth/google`: Triggers Google OAuth prompt.
  - `GET /api/auth/google/callback`: Receives authentication code, extracts user profile, generates JWT session token, and redirects back to client `/` with the token.
- Build Express middleware to parse and authenticate incoming requests via bearer JWTs.

### 5.2 Client Wiring
- Integrate login page routing: if no valid token in client storage, route operator to `/login`.
- Redirect `/login` trigger to backend server callback path.

---

## Step 6: Daemon Ingestion Engine

### 6.1 Scraper Utilities
- Install dependency for scheduling: `node-cron`.
- Implement API wrapper to request Google Places endpoints restricted to Kenyan coordinates.
- Implement address validation filter: discard places if "Kenya" string is not matched.
- Implement number normalization utility: convert local formats (e.g. prefix `07...` or `01...`) to E.164 (`254XXXXXXXXX`).

### 6.2 Quota-Filling Logic
- Implement transactional loops:
  - Fetch localized listings batch (30 items).
  - Loop entries sequentially.
  - Check database unique indices (`placeId`, `whatsappNumber`).
  - If unique, save record in DB as `PENDING`, increment counter.
  - Break immediately if counter reaches 10.
- Schedule the routine via `node-cron` expression (e.g., daily at 1:00 AM).

---

## Step 7: Verification & Polishing

### 7.1 Integration Tests
- Run backend verification scripts. Mock Google Places response to verify spatial mapping, address filtering, E.164 conversion, and duplicate rejection.
- Check database constraints for duplicate key checks.

### 7.2 UI/UX Polishing
- Implement smooth transitions and micro-animations for card removal.
- Test responsive configurations across screens.
- Add alerts for failed authentication or invalid phone formatting.
