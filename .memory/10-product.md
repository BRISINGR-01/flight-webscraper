Product Definition (10-product.md)

Users & Personas
- Primary User: Technical user (developer, data-minded engineer, or power user) comfortable working with TypeScript, Bun/Node.js, and command-line tools.
  - Needs a reliable way to repeatedly extract Ryanair flight information without manual browser interaction.
  - Values clear documentation, predictable scripts, and readable logs.

Core User Problems
- Manually searching the Ryanair website for routes and dates is slow, repetitive, and error-prone.
- Copying data into spreadsheets or tools is tedious and does not scale beyond a few queries.
- Existing generic scraping tools may not be fine-tuned for Ryanair-specific flows and data structures.

Key User Journeys
- Run a Flight Scrape
  - User installs dependencies (`bun install` in `webscraper/`).
  - User updates configuration (e.g., origin, destination, dates) in a clear place (environment variables, config file, or script parameters).
  - User runs a command such as `bun run script` (or similar).
  - The script launches Puppeteer, navigates to Ryanair, performs the search, extracts relevant data, and writes records into SQLite.
  - Logs are written for each run so the user can inspect successes, failures, and performance.

- Inspect Stored Data
  - User opens `artifacts/db.db` with a SQLite client or CLI.
  - User queries flight data, e.g., routes, prices, or timestamps, and can export or analyze it.

- Debug a Broken Scrape
  - A scraping run fails or data is missing.
  - User reviews `artifacts/error.log` and any console output from the scripts.
  - User updates selectors, navigation steps, or timing in `puppeteer.ts` or related utilities and reruns the script.

Feature Requirements (High-Level)
- Scraping:
  - Navigate to Ryanair search or relevant pages.
  - Support parameterization of key inputs (origin, destination, date, passengers, etc.).
  - Extract structured data fields (e.g., flight number, departure/arrival time, price, currency, duration, and basic metadata where feasible).
- Data Storage:
  - Define Sequelize models for core entities (e.g., FlightSearch, FlightResult, RunMetadata).
  - Migrate and manage the SQLite database schema from code, avoiding manual DB setup steps where possible.
- Logging & Observability:
  - Central logging via Winston.
  - Separate info/debug logs from error logs where appropriate, at least ensuring critical errors end up in `error.log`.
- Configuration & UX:
  - Use a simple, clear configuration mechanism (e.g., constants in `utils.ts`, environment variables, or a dedicated config module).
  - Provide minimal but clear documentation in `README.md` for how to run the main flows.

UX Guidelines (for Developers)
- Favor explicit, named functions over complex, deeply nested logic in scripts.
- Keep configuration values near the top of scripts or in dedicated config modules so they are easy to adjust.
- Fail fast with helpful error messages and logs rather than silently skipping issues.

User Metrics (Future)
- Number of successful scraping runs vs. failures.
- Time taken per run.
- Number of routes/dates covered in a given period.
- Frequency of schema/selector changes required when Ryanair updates its UI.


