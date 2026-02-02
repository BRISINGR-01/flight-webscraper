System Architecture (20-system.md)

Overview
The system is a small TypeScript-based scraping and utilities toolkit organized mainly under `webscraper/`. It combines a headless browser automation layer (Puppeteer), a persistence layer (Sequelize + SQLite), logging (Winston), and script-level orchestration. Execution is primarily via Bun, but the code is conceptually compatible with Node.js-style tooling (`"type": "module"` in `package.json`).

Main Components
- Scraping Layer
  - Implemented primarily in `puppeteer.ts`, `script.ts`, and possibly `a.ts`.
  - Responsibilities:
    - Launch and manage a Puppeteer browser and page.
    - Navigate through Ryanair pages and flows (e.g., flight searches).
    - Select and extract relevant data from the DOM.
    - Convert raw DOM data into typed, structured objects.

- Persistence Layer
  - Implemented in `db.ts` with the SQLite file `artifacts/db.db`.
  - Responsibilities:
    - Initialize Sequelize with a SQLite database.
    - Define models for flights, searches, runs, or related entities.
    - Provide helper methods for creating, querying, and updating records.

- Logging Layer
  - Implemented in `logger.ts` with `artifacts/error.log` as a primary log sink.
  - Responsibilities:
    - Configure Winston loggers (levels, transports, formats).
    - Provide a central logger instance imported by scraping and DB modules.
    - Capture info, warnings, and errors, especially unexpected runtime issues.

- Utility Layer
  - Implemented in `utils.ts`.
  - Responsibilities:
    - Encapsulate shared logic such as:
      - Date and route formatting.
      - Small data transformation helpers.
      - Reusable retry or timeout wrappers for browser operations (if implemented).

Execution Flow (Typical)
1. A user runs a script from `webscraper/` (e.g., `bun run script` or a defined Bun script).
2. The script:
   - Loads configuration (routes, dates, options).
   - Initializes logging and database connections.
   - Starts Puppeteer, opens a page, and navigates to Ryanair.
   - Performs the search, waits for results, and extracts flight data.
   - Writes structured records to SQLite via Sequelize.
   - Logs the outcome (success or detailed error information).
3. The process exits cleanly, ensuring browser and DB connections are closed.

Integration Points
- External Systems:
  - Ryanair website (HTML/JS) is the primary external dependency and may change over time.
  - Developer tooling (e.g., SQLite clients, CLIs) for inspecting `db.db`.
- Internal:
  - Scraping scripts depend on utilities, DB, and logging modules.
  - DB and logger modules are imported wherever persistence or logging is needed.

Design Patterns & Practices
- Modularization:
  - Keep Puppeteer flows encapsulated in functions that represent specific tasks (e.g., `searchFlights`, `parseResults`).
  - Separate concerns so that DB and logging can be modified or replaced with minimal impact on scraping logic.
- Configuration:
  - Prefer configuration via environment variables or a dedicated config module rather than hardcoding values throughout scripts.
- Error Handling:
  - Use try/catch blocks around major flows with logging in catch handlers.
  - Use typed errors or at least clear message strings to support quick diagnosis.

Non-Functional Characteristics
- Portability:
  - Designed to run on typical developer environments with Bun installed.
- Observability:
  - Logging centralization through Winston and a file-based log for later inspection.
- Extensibility:
  - New scraping flows can be added as new functions or scripts that reuse DB/logging/utilities.


