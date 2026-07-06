# Code Standards - Maps2Chat

To ensure project cleanliness, structural modularity, and smooth pair programming, all code written in this repository must comply with the following standards.

## General Design Principles
- **Separation of Concerns**: Keep API routing, server scheduling, database interactions, and UI rendering isolated in their respective layers.
- **Type Safety**: Strictly define interfaces for all data boundaries. Do not bypass TypeScript configurations or use `any`.
- **Clean Over Clever**: Write readable, expressive code with helpful docstrings on complex algorithms (like number transpositions or spatial checks).

## Naming Conventions

### File & Directory Names
- **Directories**: Always use `kebab-case` (e.g. `src/hooks`, `src/pages`, `components/theme-provider`).
- **React Components**: Always use `PascalCase` (e.g. `LeadCard.tsx`, `SidebarNav.tsx`).
- **Utility/Source Files**: Use `camelCase` or `kebab-case` for simple script modules (e.g. `phoneFormatter.ts`, `placesClient.ts`).

### Code Identifiers
- **TypeScript interfaces & types**: PascalCase (e.g. `interface LeadRecord`, `type IngestionConfig`).
- **Functions & variables**: camelCase (e.g. `const formatPhoneNumber = (num: string) => {}`).
- **Enums**: PascalCase with UPPERCASE keys (e.g. `enum LeadStatus { PENDING, CONTACTED, ARCHIVED }`).

## TypeScript & ES6+ Conventions

- **Strict Mode**: Ensure `strict: true` is configured in `tsconfig.json`.
- **Imports**: Prefer explicit imports over default imports. Use import aliases if configured.
- **Async Code**: Always use `async/await` syntax instead of promise chaining (`.then()`). Wrap asynchronous operations in `try/catch` blocks to ensure robust error handling.

## React & Styling (Client)

- **Component Creation**: Use functional components with standard hooks.
- **React Router**: Organize navigation boundaries cleanly inside `client/src/App.tsx`.
- **Queries & Mutations**: Keep all API fetches wrapped inside TanStack Query hooks. Avoid inline `useEffect` calls for fetching data.
- **CSS Utility Classes**: Style layouts using Tailwind. Limit inline CSS style objects strictly to dynamic computed heights or transforms.
- **Form Control**: Wrap form controls inside Zod validation schemas. Pass them directly to React Hook Form for client side validation.

## Express REST API & Database (API)

- **Request Parsing**: Standardize routing payloads with express JSON parser.
- **Controller Pattern**: Separate routes configuration (`routes/`) from actual request handling logic (`controllers/`).
- **Prisma Client**: Ensure a single Prisma Client instance is shared globally to avoid exhausting PostgreSQL connection pools. Import Prisma from a central helper file:
  ```typescript
  import { PrismaClient } from '@prisma/client';
  export const prisma = new PrismaClient();
  ```
- **Error Handling**: Use Express global error-handling middlewares. Never expose raw database errors or stack traces in production JSON responses.

## API Response Shape
All JSON payloads returned by backend endpoints must conform to a unified standard structure:

### Success Response
```json
{
  "success": true,
  "data": {
    // Returned data object or array
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Descriptive client-facing error message here"
}
```
