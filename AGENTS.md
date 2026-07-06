# Maps2Chat - Agent Guidelines & Rules

This document specifies the rules, design guidelines, and standards for any AI agent working on the Maps2Chat project. Always adhere to these parameters.

## Context Reading Order
Before performing any development, configuration, or structural coding task, you must read the project documentation files in the [context/](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context) directory sequentially in the following order to align on scope, logic, and design patterns:
1. **[project-overview.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/project-overview.md)**: Overall application scope, Kenya targeting criteria, and in/out-of-scope features.
2. **[architecture.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/architecture.md)**: Database schemas (Prisma), system boundaries, and bounding box dimensions.
3. **[code-standards.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/code-standards.md)**: TypeScript typing practices, file name conventions, and standard API response forms.
4. **[library-docs.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/library-docs.md)**: Shared connection code snippets, library patterns (Prisma Client, Express, React Query).
5. **[ui-rules.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/ui-rules.md)**: Layout, padding guidelines, components radius, and color definitions.
6. **[ui-tokens.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/ui-tokens.md)**: CSS variables mapping light/dark mode and active Tailwind configs.
7. **[ui-registry.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/ui-registry.md)**: Built components list and reusable template properties.
8. **[build-plan.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/build-plan.md)**: Chronological implementation schedule (UI-first steps).
9. **[progress-tracker.md](file:///c:/Users/Johnny/Agy_test/Maps2Chat/context/progress-tracker.md)**: Checklists tracking task completions and developer choices.

## Directory Boundaries & Monolith Structure
- Keep a clean boundary between the client and api systems:
  - **`api/`** is the backend Node.js/Express system. No frontend files or styling configs.
  - **`client/`** is the React.js frontend system. No database queries or server logic.
- Do not add workspace configuration files at the root level if they belong to `api/` or `client/` (e.g., package.json, tsconfig.json, vite.config.ts should reside in their respective directories).
- Each project subdirectory must maintain its own independent `.env` file (never share or merge them into a single root `.env`).

## Backend Rules (`api/`)
1. **Database & ORM**:
   - Use Serverless PostgreSQL on Neon.
   - Access persistence exclusively via Prisma ORM. Do not write raw SQL queries unless forced to due to query complexity.
   - Run migrations using Prisma CLI.
2. **Environment Variables**:
   - Always load variables via dotenv. Required variables: `DATABASE_URL`, `GOOGLE_PLACES_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `JWT_SECRET`, `PORT`.
3. **Daemon / Scraper**:
   - The ingestion daemon must fetch exactly 10 new, uncontacted leads per day using a state-machine that stops immediately once `savedCount === 10`.
   - Apply strict Kenya bounding coordinates:
     - Southern: -4.71, Western: 33.84, Northern: 4.63, Eastern: 41.92.
   - String normalization must discard addresses without "Kenya".
   - E.164 transposition must prefix local number strings with `254`.
4. **Google OAuth 2.0**:
   - Rely strictly on Google OAuth 2.0 for all authentication. No password-based workflows.

## Frontend Rules (`client/`)
1. **Framework & State**:
   - React.js with TypeScript.
   - Routing must use `react-router-dom`.
   - Querying, fetching, caching, and state synchronization must be done via TanStack React Query (`@tanstack/react-query`).
2. **UI & Styling**:
   - Style exclusively with Tailwind CSS and shadcn/ui.
   - Follow the primary "Emerald" theme. Maintain clean light/dark modes using the standard shadcn/ui ThemeProvider setup.
3. **Forms & Validation**:
   - Implement all forms using React Hook Form wrapped in the shadcn Form components.
   - Schema validation must be strictly defined and parsed using Zod.
4. **Interactive Flows**:
   - Use the Human-in-the-Loop paradigm: the system creates a link targeting `wa.me/254XXXXXXXXX?text=...`, opens it in a new tab, and silently updates the status in the backend database to `CONTACTED`.

## Quality Guidelines
- Avoid using `any` in TypeScript. Ensure every API payload and database schema is strongly typed.
- Pre-fill env templates (`.env.example`) with dummy values to ensure proper setup.
