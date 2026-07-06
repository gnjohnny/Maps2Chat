# Project Overview - Maps2Chat

## About the Project
Maps2Chat is a specialized, lightweight Customer Relationship Management (CRM) application and automated lead acquisition pipeline. It is custom-optimized to target localized business entities within Kenya by extracting publicly available business listing data from the Google Places API ecosystem.

## The Problem It Solves
Building B2B outreach campaigns requires scraping, cleaning, validating, and managing business contact details. Normal scraping solutions often collect invalid telephone numbers or grab global listings. Additionally, automated WhatsApp spamming leads to swift account bans. 

Maps2Chat solves this by:
1. Targeting search requests specifically within Kenya using coordinates.
2. Filtering out addresses that do not contain the keyword "Kenya".
3. Transposing phone numbers to E.164 format prefixed with Kenya's country code (`254`).
4. Employing a **Human-in-the-Loop** operational paradigm where contact delivery is initiated client-side through native user clicks, keeping outreach natural and spam-compliant.

## Pages / Routing
The client-side React monolith exposes the following routes:
- `/login` - Google OAuth 2.0 redirection and landing page.
- `/` - Main Operator Dashboard, presenting the three pipeline views:
  - **Pending Queue** (Leads matching `PENDING` status).
  - **Contacted Ledger** (Leads matching `CONTACTED` status).
  - **Archived Vault** (Leads matching `ARCHIVED` status).

## Core User Flows
1. **Authentication**: Operator visits the app -> Clicks "Login with Google" -> Authenticates via Google OAuth 2.0 -> Redirected back with a session token.
2. **Lead Generation**: A server-side scheduler (cron job) executes periodic Google Places queries restricted to the Kenya bounding box. It pulls a batch of 30 listings, filters/deduplicates them against existing database entries, and saves exactly 10 new, uncontacted leads per day to the database.
3. **Outreach Execution**: Operator loads the dashboard -> views list of `PENDING` leads -> clicks the WhatsApp link (`wa.me`) -> a new browser tab opens with a pre-filled message -> a client-side API call updates the lead status to `CONTACTED` -> dashboard refreshes, and the lead moves out of the Pending Queue.
4. **Lead Management**: The operator can manually flag irrelevant or invalid leads as `ARCHIVED` from the dashboard to keep them permanently hidden while preserving their unique key states to prevent re-scraping in subsequent database sweeps.

## Features In Scope
- **Geographically Restricted Scraper**: Automated query routine utilizing a `locationRestriction` rectangular bounding box covering Kenya.
- **Fail-Safe Address Filter**: Strips address data and drops listings that do not explicitly contain the text "Kenya".
- **E.164 Number Transposition**: Normalizes local phone strings starting with `07` or `01` to standard `254XXXXXXXXX` format.
- **Deduplication Engine**: Restricts saves to unique `placeId` and `whatsappNumber` combinations.
- **Quota Management**: Stops the scraping routine immediately once exactly 10 new listings have been successfully saved for the day.
- **Human-in-the-Loop Messaging**: Generates custom WhatsApp `wa.me` links with pre-filled messages.
- **Dynamic Operator Dashboard**: Displays Leads split into Pending Queue, Contacted Ledger, and Archived Vault.
- **Light/Dark Mode Theme**: Custom React application theme using Tailwind CSS and shadcn/ui.
- **Google OAuth 2.0 Login**: Restricts access to authenticated Google users.

## Features Out of Scope
- **Automated WhatsApp API Senders**: No direct API integration for messaging is allowed, ensuring compliance with spam restrictions and avoiding account bans.
- **Multi-country/Global Queries**: Out of scope; target is strictly localized to Kenya.
- **Custom Email/Password registration**: Only Google OAuth 2.0 is supported.

## Success Criteria
- Ingestion scraper successfully fetches and persists exactly 10 unique Kenya-located leads per scheduler run.
- Localized phone numbers are correctly formatted to E.164 `254` standard.
- Clicking the WhatsApp contact button successfully launches the WhatsApp Web/App interface and triggers a silent state update in the database to `CONTACTED`.
- Archived leads are excluded from the main workspace view but kept in database state to prevent re-scraping.
