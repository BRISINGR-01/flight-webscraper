System Patterns (systemPatterns.md)

Architecture Overview
- **Layers**:
  - Scraper (Puppeteer) → collects price data from Ryanair.
  - Data layer (Sequelize + SQLite) → stores `DatePrice` and `Trip`.
  - API layer (Bun server) → exposes JSON endpoints over HTTP.
  - UI layer (React-Bootstrap + Recharts) → user-facing trip and price visualisation.

Key Technical Decisions & Patterns
- **Model separation**:
  - `DatePrice` holds raw per-date price observations.
  - `Trip` represents a user-defined window over those observations.
  - Pattern: **raw data vs. user-defined view**.
- **Backend-driven business logic**:
  - Validation (date formats, range sanity, return-after-depart rule) lives on the server.
  - Aggregation (price history + cheapest current) computed in `db.ts` for reuse by any client.
  - Pattern: **thin clients, thick API**.
- **REST-style endpoints**:
  - Predictable resource-based endpoints:
    - `/airlines`, `/trips`, `/trips/:id/prices`.
  - Use of JSON and simple HTTP verbs (GET/POST/DELETE).

Component Relationships
- Scraper:
  - Writes `DatePrice` rows based on Ryanair DOM extraction.
- Database:
  - `DatePrice` and `Trip` share airline + route info but have distinct responsibilities.
- API:
  - Reads `Trip` and `DatePrice` and shapes them into usable responses for the UI.
- UI:
  - Calls API to manage trips and show price trends, never touching SQLite directly.

Design Practices
- **Modularisation**:
  - Scraper logic isolated in `puppeteer.ts` and utilities (`utils.ts`).
  - Persistence concerns isolated in `db.ts`.
  - HTTP concerns isolated in `server.ts`.
- **Validation at multiple layers**:
  - Backend enforces hard rules.
  - Frontend duplicates key rules for faster, clearer UX (e.g., earliest return date check).
- **Declarative visualisation**:
  - Recharts used to describe charts in terms of data bindings rather than manual drawing logic.


