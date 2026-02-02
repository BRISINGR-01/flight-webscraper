Tech Context (techContext.md)

Technologies Used
- **Backend & Scraper**:
  - TypeScript + Bun runtime.
  - Puppeteer for headless browser automation.
  - Sequelize ORM with SQLite (`artifacts/db.db`) as the backing store.
  - Bun HTTP server in `webscraper/server.ts` for the JSON API.
- **Frontend**:
  - React 18 with TypeScript.
  - Vite as the dev/build tool.
  - React-Bootstrap and Bootstrap 5 for layout and components.
  - Recharts for time-series price charts.

Development Setup
- **Scraper/API**:
  - `cd webscraper && bun install`.
  - Start API: `bun run server.ts` (or `bun run server` via package script).
  - API default port: `3001`.
- **UI**:
  - `cd ui && npm install` (or `bun install`).
  - Start dev server: `npm run dev`.
  - UI default port: `5173`.
  - UI communicates with API at `http://localhost:3001`.

Technical Constraints
- Local-first environment:
  - Assumes Bun, Node tooling, and SQLite are available on the developer machine.
- Schema and selector fragility:
  - Ryanair DOM structure may change; selectors in `puppeteer.ts` must be maintained.
  - DB schema changes must be coordinated with API and UI expectations.
- Single-DB, single-process:
  - SQLite is file-based; for now, no clustering or sharding is considered.

Dependencies & Their Roles
- **puppeteer**: Headless scraping and DOM interaction.
- **sequelize** + **sqlite3**: ORM and DB driver.
- **winston**: Logging (currently used as part of the original scraper infrastructure).
- **react**, **react-dom**: UI runtime.
- **react-bootstrap**, **bootstrap**: Component library and styling.
- **recharts**: Charting library for price graphs.
- **vite**, **@vitejs/plugin-react-swc**: Fast dev server and build pipeline for the UI.


