# Current Focus & State (40-active.md)

Current Focus

- Extend the original Ryanair scraper into a small system with:
  - A Bun-based HTTP API over the existing SQLite DB.
  - A React-Bootstrap UI for defining trips and visualising price history like a crypto chart.
- Ensure that core system requirements (trip management, date rules, price history, cheapest current price) are explicitly implemented and documented.

Recently Implemented

- **Database & Models** (`webscraper/db.ts`):
  - Introduced `Trip` model alongside `DatePrice` to store:
    - `airline`, `fromAirport`, `toAirport`.
    - `fromEarliest`, `fromLatest`, `toEarliest`, `toLatest`.
  - Added helpers:
    - `listTrips`, `createTrip`, `deleteTrip`, `getDistinctAirlines`.
    - `getPriceHistoryForTrip(tripId)` which:
      - Queries `DatePrice` for the trip’s full window.
      - Computes `cheapestCurrent` from today onwards.
- **Backend API** (`webscraper/server.ts`):
  - CORS-enabled Bun server on port `3001`.
  - Endpoints:
    - `GET /airlines`, `GET /trips`, `POST /trips`, `DELETE /trips/:id`, `GET /trips/:id/prices`.
  - Enforces business rule that the earliest return must be at least one day after the earliest departure, plus basic date-range validity.
- **Frontend UI** (`ui/`):
  - Vite + React + TypeScript app using `react-bootstrap` and `recharts`.
  - Features:
    - Airline selector (from `/airlines`).
    - Trip creation form with client-side validation mirroring backend rules.
    - Trip list with open/delete actions.
    - Detail view showing:
      - Crypto-style line chart of price history.
      - Cheapest current price summary.

Open Items / Next Considerations

- Confirm that the scraper populates `DatePrice` in a way that covers the trip windows the user configures.
- Optionally add:
  - Filtering by airline and route on `/trips`.
  - Health/status endpoint for scraper and API.
  - Basic auth or local-only access controls if needed.

Near-Term Maintenance Priorities

- Keep `.memory` in sync as:
  - New airlines are added to the `Airline` enum in `utils.ts`.
  - DB schema evolves (e.g., adding currencies or more route metadata).
  - UI gains new comparison or analytics views.
- Monitor for breaking changes in the Ryanair website that affect Puppeteer selectors and update scraping logic accordingly.
