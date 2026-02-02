Active Context (activeContext.md)

Current Work Focus
- Evolve the project from a standalone scraper into a **small, end-to-end price tracking system**:
  - Scraper → SQLite (`DatePrice`).
  - Bun API → exposes trips and price history.
  - React-Bootstrap UI → trip management + crypto-style charts.

Recent Changes
- Added `Trip` model and supporting functions in `webscraper/db.ts`.
- Implemented Bun HTTP API in `webscraper/server.ts` with endpoints:
  - `/airlines`, `/trips`, `/trips/:id/prices`, etc.
- Built a React UI in `ui/` using React-Bootstrap and Recharts that:
  - Manages trips (create, open, delete).
  - Enforces **earliest return ≥ earliest depart + 1 day** on the client.
  - Visualises price history + cheapest current price per trip.

Next Steps
- Ensure scraping coverage matches user-defined trips:
  - Verify that `DatePrice` is populated for the trip’s outbound and return windows.
  - Potentially add controls or scripts to trigger scrapes for specific trips.
- Improve analytics and UX:
  - Add filtering, sorting, or tagging of trips.
  - Explore additional chart views (e.g., separate lines for outbound vs return, volatility metrics).

Active Decisions & Considerations
- Keep the backend as the **single source of truth** for:
  - Business rules (date constraints).
  - Aggregations (price history and cheapest current price).
- Maintain the Memory Bank up-to-date as:
  - DB schema evolves (new fields or entities).
  - API surface area grows.
  - UI gains new features or workflows.


