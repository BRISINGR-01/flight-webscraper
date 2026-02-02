Technology Landscape (30-tech.md)

Languages & Runtimes
- **TypeScript**: primary language for the scraper (`webscraper/`), Bun server, and React UI.
- **Bun**: main runtime for backend tooling and the HTTP API (`bun run server.ts`).
- **Node-compatible React toolchain**: Vite + React + TypeScript for the frontend UI in `ui/`.

Backend Stack (Scraper + API)
- **Puppeteer**:
  - Automates a headless Chromium instance to interact with Ryanair’s website.
  - Extracts daily price data into structured `{ date, price }` pairs.
- **Sequelize + SQLite**:
  - SQLite DB stored at `webscraper/artifacts/db.db`.
  - Models:
    - `DatePrice`: `{ airline, fromAirport, toAirport, takeOff?, landing?, date, price }` – stores per-date prices.
    - `Trip`: `{ id, airline, fromAirport, toAirport, fromEarliest, fromLatest, toEarliest, toLatest }` – captures user-defined trips with outbound/return windows.
  - Used by both the scraping pipeline and the HTTP API.
- **HTTP API (Bun server in `webscraper/server.ts`)**:
  - Serves JSON over HTTP with CORS enabled for the React UI.
  - Endpoints:
    - `GET /airlines`: distinct airlines in `DatePrice`.
    - `GET /trips`: list all trips.
    - `POST /trips`: create a trip, enforcing system rules:
      - All dates must be `YYYY-MM-DD`.
      - `fromLatest >= fromEarliest`, `toLatest >= toEarliest`.
      - **Business rule**: `toEarliest >= fromEarliest + 1 day`.
    - `DELETE /trips/:id`: delete a trip.
    - `GET /trips/:id/prices`: returns `{ history: {date, price}[], cheapestCurrent: {date, price} | null }` for the trip’s date window.

Frontend Stack (React UI)
- **Vite + React + TypeScript** in `ui/`:
  - `vite.config.ts`: React SWC plugin; dev server on port `5173`.
  - `tsconfig.json`: strict TypeScript config for the UI.
- **React-Bootstrap + Bootstrap 5**:
  - Layout and components: `Container`, `Row`, `Col`, `Card`, `Form`, `Button`, `Alert`, `ListGroup`, `Spinner`, etc.
  - Styling via CDN-loaded Bootstrap CSS in `ui/index.html`.
- **Recharts**:
  - Renders a crypto-style line chart of price vs date using `LineChart`, `Line`, `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`.

System-Level Requirements Encoded in Tech
- **Trip management**:
  - Users can choose airline, then create/delete/select trips in the UI.
  - Trips are persisted via the `Trip` Sequelize model and surfaced through the API.
- **Date rules**:
  - Enforced on both:
    - **Backend** (`POST /trips`) – rejects invalid ranges or a return starting before `fromEarliest + 1 day`.
    - **Frontend** (`App.tsx`) – client-side validation with user-friendly error messages.
- **Price history & cheapest price**:
  - `getPriceHistoryForTrip` in `db.ts` queries `DatePrice` over `[fromEarliest, toLatest]`.
  - Computes `cheapestCurrent` as the minimum price on or after “today”.
  - UI consumes this via `/trips/:id/prices` and:
    - Displays `cheapestCurrent` in a highlighted card.
    - Draws a time-series chart of `history` like a crypto price chart.

Operational Notes
- Backend server:
  - Start from `webscraper/` with `bun run server.ts` (or `bun run server` via `package.json` script).
  - Listens on `http://localhost:3001`.
- Frontend:
  - Start from `ui/` with `npm run dev` (or `bun run dev`), default `http://localhost:5173`.
  - Communicates with backend via `http://localhost:3001` (defined as `API_BASE` in `ui/src/App.tsx`).
