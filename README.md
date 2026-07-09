# Maps2Chat

Maps2Chat is a lightweight Customer Relationship Management (CRM) application and automated B2B lead generation pipeline custom-optimized for localized business outreach within Kenya. 

It leverages the **Google Places API** to extract uncontacted business listings, normalizes and transposes telephone numbers to standard E.164 format, and implements a compliant **Human-in-the-Loop (HITL)** operational paradigm for initiating WhatsApp outreach.

---

## 🚀 Key Features

*   **Geographically Restricted Scraper**: Automated query sweeps utilizing Google Places searchText API, restricted to the Kenya geographic coordinates bounding box.
*   **Fail-Safe Address Filtering**: Strips out listings whose addresses do not explicitly contain the keyword `"Kenya"`.
*   **E.164 Phone Transposition**: Intelligently transposes local Kenyan numbers (prefixes starting with `07...`, `01...`, or landline `020...`) to the standard `254XXXXXXXXX` international format.
*   **Ingestion Quota Management**: Autonomous daily daemon sweeps that halt execution immediately once exactly 10 new unique leads have been fetched and persisted for the day.
*   **Human-in-the-Loop Outreach**: Native outreach utilizing custom pre-filled `wa.me` links opened in new tabs, ensuring compliance with anti-spam terms and account safety.
*   **Dynamic Operator Dashboard**: Segmented views separating leads by state:
    *   **Pending Queue**: High-priority uncontacted leads with inline WhatsApp contact links.
    *   **Contacted Ledger**: Historical log of successfully initiated campaigns with timestamp logs.
    *   **Archived Vault**: Suppressed or deleted leads kept to prevent re-scraping and maintain pipeline deduplication.
*   **Secure Google OAuth 2.0 Login**: Restricted passport-backed JWT token authentication.
*   **Responsive Theme Support**: Dark/Light mode design system using the premium Emerald theme.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| --- | --- | --- |
| **Database** | Neon Serverless PostgreSQL | Relational cloud database. |
| **ORM** | Prisma ORM | Typesafe schema modeling and schema migrations. |
| **Backend API** | Node.js + Express | Lightweight REST API endpoint server. |
| **Daemon** | Node-cron | Native scheduler daemon for background ingestion. |
| **Frontend** | React + TypeScript (Vite) | Single Page Application framework. |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first styling with modern custom UI components. |
| **State** | TanStack React Query | Server-side query caching and mutations handler. |

---

## 📁 Repository Structure

```
/
├── api/                  # Express REST API & Database layers
│   ├── prisma/           # Prisma schema and migration records
│   ├── src/
│   │   ├── config/       # Google Strategy Passport configuration
│   │   ├── controllers/  # Route handler controllers
│   │   ├── daemon/       # Places API scraper client and scheduler
│   │   ├── middleware/   # JWT verification and error handlers
│   │   ├── routes/       # API routers (leads, auth)
│   │   ├── utils/        # Phone number transposition helpers
│   │   └── index.ts      # Server entry point
│   └── package.json
├── client/               # React Frontend
│   ├── src/
│   │   ├── components/   # UI components (theme provider, layout, forms)
│   │   ├── hooks/        # React Query hooks (useLeads, useContactLead)
│   │   ├── pages/        # Route page views (Dashboard, Details, Login)
│   │   └── main.tsx      # Client entry point
│   └── package.json
├── context/              # Architectural blueprints & agent guidelines
├── package.json          # Monorepo build orchestrator
└── README.md
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have the following installed on your local environment:
*   [Node.js](https://nodejs.org/) (v18.x or higher)
*   [npm](https://www.npmjs.com/) (v9.x or higher)
*   A running PostgreSQL instance (or Neon project database)

### 2. Clone the Repository and Install Dependencies
Install dependencies globally for both workspace packages from the root:
```bash
npm install
```
*(This triggers a root postinstall hook that automatically runs npm install inside both `/api` and `/client` directories).*

### 3. Configure Environment Variables
You must configure separate `.env` files for both the API and client directories.

#### **Backend (`/api/.env`)**
Create `/api/.env` and configure:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_token_here
CLIENT_URL=http://localhost:5173

# Neon database connection string
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Google Integrations
GOOGLE_PLACES_API_KEY="your_google_places_api_key"
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# Render Environment Variable (Production deployment self-ping URL)
RENDER_EXTERNAL_URL=
```

#### **Frontend (`/client/.env`)**
Create `/client/.env` and configure:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run Database Migrations
Initialize your database schemas using the Prisma CLI:
```bash
npm run build:api
```
*(Alternatively, run `npx prisma db push` or `npx prisma migrate dev` from the `/api` directory).*

### 5. Running the Application

#### **Development Mode**
To run the client and server separately for development:
*   **Start the backend server** (port `5000`):
    ```bash
    npm run dev --prefix api
    ```
*   **Start the client server** (port `5173`):
    ```bash
    npm run dev --prefix client
    ```

#### **Production Mode**
To compile production builds and start the unified server:
```bash
# Build both packages
npm run build

# Start the unified backend (serves compiled static assets from client/dist)
npm start
```

---

## 🔗 Key Operational Workflows

### The Ingestion Loop
1. The ingestion daemon runs daily at **9:00 AM** (customizable in [scraper.ts](file:///C:/Users/Johnny/Agy_test/Maps2Chat/api/src/daemon/scraper.ts)).
2. It fetches listings using the Google Places API inside the bounding box of Kenya:
   * **South**: `-4.71` | **West**: `33.84` | **North**: `4.63` | **East**: `41.92`
3. Each listing is normalized (removes non-Kenyan entities, formats the phone number, and deduplicates against existing records).
4. The loop stops immediately when **exactly 10 new uncontacted leads** are saved.

### Human-in-the-Loop Outreach
1. Navigate to the dashboard.
2. In the **Pending Queue**, click **"Contact via WhatsApp"** on any lead card.
3. This opens a new browser tab with the endpoint `https://wa.me/254...` containing a preconfigured outreach message.
4. Concurrently, a mutation sends a silent state change PATCH to the backend database, moving the lead status to `CONTACTED` and updating `contactedAt` time.
5. The lead dynamically relocates from the **Pending Queue** to the **Contacted Ledger** without manual refresh.
