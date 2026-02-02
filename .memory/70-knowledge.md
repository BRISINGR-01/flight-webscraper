Domain & Project Knowledge (70-knowledge.md)

Key Concepts

- **DatePrice**:
  - Raw price point for a specific date and route:
    - `airline`, `fromAirport`, `toAirport`, `date`, `price`, optional `takeOff`/`landing`.
  - Populated by the Puppeteer scraper.
- **Trip**:
  - User-defined entity describing a round-trip “idea”:
    - `airline`, `fromAirport`, `toAirport`.
    - Outbound window: `fromEarliest`–`fromLatest`.
    - Return window: `toEarliest`–`toLatest`.
  - Primary unit of interaction in the UI (create, open, delete).

Important Business Rules

- **Return-after-depart rule**:
  - `toEarliest` must be **≥** `fromEarliest + 1 day`.
  - Enforced in:
    - Backend: `POST /trips` in `server.ts`.
    - Frontend: trip creation form in `ui/src/App.tsx`.
- **Cheapest current price**:
  - Defined as the **minimum price on or after today** within the trip’s overall date window.
  - Computed in `getPriceHistoryForTrip` by:
    - Filtering `history` to `date >= today`.
    - Reducing to the lowest `price`.

API Behaviour Summary

- **GET /airlines**:
  - Returns `{ airlines: string[] }`.
  - Backed by `getDistinctAirlines` in `db.ts`.
- **GET /trips**:
  - Returns `{ trips: Trip[] }`, ordered by `id`.
- **POST /trips**:
  - Body: `{ airline, fromAirport, toAirport, fromEarliest, fromLatest, toEarliest, toLatest }`.
  - Validates:
    - Non-empty airline and airports.
    - All dates in `YYYY-MM-DD` format.
    - `fromLatest >= fromEarliest`, `toLatest >= toEarliest`.
    - `toEarliest >= fromEarliest + 1 day`.
  - On success: returns created trip with `id`.
- **DELETE /trips/:id**:
  - Deletes trip by id; no-op if not found.
- **GET /trips/:id/prices**:
  - Returns `{ history, cheapestCurrent }` where:
    - `history` is sorted ascending by date.
    - `cheapestCurrent` can be `null` if there is no data from today onward.

Frontend Behaviour Summary

- **Trip creation**:
  - Form requires airline and both airports plus all four dates.
  - Shows a clear error if the earliest return violates the +1 day rule.
  - Displays airport names in human readable format
- **Trip list**:
  - Displays airline, route, and date windows.
  - Provides “Open” (loads graph) and “Delete” actions.
- **Price view**:
  - Shows current cheapest price in a prominent success alert.
  - Renders a crypto-style line chart of price vs date using Recharts.

Useful Mental Models

- Think of `DatePrice` as the time-series data source and `Trip` as a **lens** over that time series.
- The UI is intentionally thin: it delegates business rules and aggregations (price history + cheapest current) to the backend so multiple frontends could share the same logic.
