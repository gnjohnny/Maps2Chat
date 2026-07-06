# Architecture Specification - Maps2Chat

## Technical Stack

| Layer | Tool / Library | Purpose |
|---|---|---|
| **Database** | Neon Serverless PostgreSQL | Relational storage with cloud autoscaling and serverless drivers. |
| **ORM** | Prisma | Typesafe schema modeling, migrations, and query construction. |
| **Backend API** | Node.js + Express | Lightweight REST API server. |
| **Ingestion Daemon** | Node-cron / Native timers | Schedules autonomous background scraping. |
| **Frontend Framework** | React.js (via Vite) | Client-side reactive views. |
| **Styling** | Tailwind CSS + shadcn/ui | Emerald theme utility classes and component primitive libraries. |
| **State & Queries** | TanStack React Query | Cache management and API request synchronization. |
| **Routing** | React Router (`react-router-dom`) | Single Page Application route management. |
| **Validation** | Zod | Client-side and server-side runtime type validation. |
| **Forms** | React Hook Form | Dynamic form state tracking and validation wiring. |

## Folder Structure

```
/
├── api/
│   ├── prisma/
│   │   └── schema.prisma    # Prisma database model
│   ├── src/
│   │   ├── controllers/      # API Controllers
│   │   ├── daemon/           # Ingestion scraper and scheduler
│   │   ├── middleware/       # Google OAuth and JWT auth handlers
│   │   ├── routes/           # API routes
│   │   └── index.ts          # Express entry point
│   ├── .env.example          # Template backend configurations
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/       # Reusable shadcn/ui components
│   │   ├── hooks/            # Custom React hooks (React Query mutations)
│   │   ├── pages/            # Dashboard page views (Pending, Contacted, Vault)
│   │   ├── App.tsx           # Application routes and Context Providers
│   │   └── main.tsx          # Client entry point
│   ├── .env.example          # Template client configurations
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── context/                  # Project scaffolding files
└── AGENTS.md                 # Standalone developer guidelines
```

## System Boundaries

- **`api/src/daemon/`**: Governs Place API connections, coordinate bounding, and deduplication logic. It is strictly server-side and has no connection to the frontend UI layer.
- **`api/src/routes/`**: Exposes secure JSON-only REST routes (`/api/leads`, `/api/auth`).
- **`client/src/`**: Consumes backend JSON payloads and renders the React dashboard. Client components must never access the database or external APIs directly; all requests must flow through the Express API router.

## Geographic Bounding & Filters

### Kenya Bounding Polygon (locationRestriction)
Every search request payload to the Google Places API must map the bounding coordinates of Kenya:
- **Southern Limit**: Latitude `-4.71`
- **Western Limit**: Longitude `33.84`
- **Northern Limit**: Latitude `4.63`
- **Eastern Limit**: Longitude `41.92`

### Multi-Stage Filtering Validation
```
API Response Payload -> String Normalization -> Number Transposition -> Persistence Core
```
1. **String Normalization**: Confirm `address` field contains "Kenya" (case-insensitive). If missing, drop the entity.
2. **Number Transposition**: Parse local phone strings (e.g., prefix `07...` or `01...`), strip whitespace/symbols, and prepend with the `254` international country identifier.

## Database Schema (Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum LeadStatus {
  PENDING
  CONTACTED
  ARCHIVED
}

model Lead {
  id              String      @id @default(uuid())
  placeId         String      @unique
  name            String
  address         String
  whatsappNumber  String      @unique
  status          LeadStatus  @default(PENDING)
  fetchedAt       DateTime    @default(now())
  contactedAt     DateTime?

  @@index([status])
}
```

## Architectural Invariants

- **Lead Deduplication**: The combination of `placeId` and `whatsappNumber` must remain unique. Prisma model constraints enforce `unique` indexes on both fields.
- **Scraper Rate Limiting**: The cron service must enforce a strict daily quota limit. If `savedCount` reaches 10, the loop must break immediately, discarding remaining search results, and return to idle state.
- **Client-Side Trigger Only**: WhatsApp messages are triggered only via native user click events (`wa.me` standard hyperlink). The Express backend never interacts directly with the WhatsApp API.
- **State Integrity**: An API request to update a lead status to `CONTACTED` must silently set `contactedAt = new Date()` in the database.
