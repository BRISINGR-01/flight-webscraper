# Project: Ryanair Flight Scraper & Utility Toolkit

Overview
This repository contains a TypeScript-based web scraping and utilities toolkit focused on Ryanair flight data. The core of the project lives under the `webscraper/` directory and is built around a Bun ecosystem, using Puppeteer for browser automation, SQLite (via Sequelize) for lightweight persistence, and Winston for structured logging. The goal is to provide a reliable, repeatable way to extract, store, and potentially process flight information or related data from Ryanair’s web properties.

Scope

- Core focus: programmatically interact with Ryanair web pages (e.g., flight search, pricing, availability, or other public-facing data) and make this data accessible for downstream use (e.g., analysis, experimentation, or internal tools).
- Primary runtime: Bun (as per `webscraper/README.md`).
- Target users: developers and power users who need an automated, scriptable way to pull flight-related data rather than manually using the Ryanair website and ordinary travellers who can open a webapp to check flight prices.
- Environment: local development first; extensible to remote or CI environments if needed.

Key Use Cases

- Run a script that:
  - Launches a Puppeteer-controlled browser to navigate Ryanair pages.
  - Executes custom flows (e.g., search for flights between given airports on given dates).
  - Extracts relevant information (prices, times, availability, metadata) into structured objects.
  - Persists data into a local SQLite database for later querying or analysis.
- Experiment with scraping and automation flows against Ryanair pages without manually reconfiguring a full codebase each time.
- Log scraping runs, errors, and performance metrics in a structured way for debugging and monitoring.

High-Level Architecture

- `webscraper/puppeteer.ts` (and related scripts like `script.ts`, `a.ts`):
  - Own browser automation logic using Puppeteer.
  - Encapsulate navigation, DOM interaction, and data extraction logic.
- `webscraper/db.ts` and `webscraper/artifacts/db.db`:
  - Define and manage a SQLite database interface via Sequelize.
  - Provide models and helper utilities to persist scraped data.
- `webscraper/logger.ts` and `webscraper/artifacts/error.log`:
  - Centralize logging setup using Winston.
  - Capture runtime info, warnings, and errors for observability and debugging.
- `webscraper/utils.ts`:
  - Contain cross-cutting helpers (e.g., date/URL formatting, retry helpers, parsing utilities).

Technical Specifications

- Language: TypeScript (with Bun runtime and a `tsconfig.json` for compilation/type-checking).
- Runtime: Bun v1.2.20+ (per README), targeting modern Node-style module resolution (`"type": "module"` in `package.json`).
- Dependencies:
  - Puppeteer: browser automation and DOM interaction.
  - Sequelize + sqlite3: lightweight relational storage in a file-backed SQLite DB.
  - Winston: structured, leveled logging.
- Artifacts:
  - `artifacts/db.db`: SQLite database file used for local persistence.
  - `artifacts/error.log`: main error/log output file.

Non-Functional Requirements & Constraints

- Scraping Reliability:
  - Handle common transient errors such as navigation timeouts, changed selectors, or network instability.
  - Use retries, timeouts, and defensive checks to minimize failed runs.
- Performance:
  - Prefer headless scraping where possible and practical.
  - Limit resource usage for typical developer machines; avoid unnecessary concurrent sessions.
- Maintainability:
  - Keep scraping logic modular and encapsulated per flow to make updates easier when Ryanair changes their UI.
  - Use logging and typed utilities to reduce brittle logic.
- Ethics & Compliance:
  - Intended use is for personal, internal, or research purposes where scraping is permitted.
  - Users of this repository are responsible for ensuring compliance with Ryanair’s terms of service, robots.txt, and relevant legal/ethical considerations.

Out of Scope (for now)

- Production-grade deployment (e.g., horizontally scaled scraping infrastructure).
- Full-blown ETL pipeline or analytics/visualization layer on top of scraped data.
- APIs or GUIs for third-party consumers; current focus is scripts and CLIs for direct developer use.

Vision
The long-term vision is to provide a clean, extensible foundation for Ryanair-focused scraping and automation tasks. It should be easy to:

- Add new scraping flows (e.g., additional routes, ancillary data, or user flows).
- Extend storage models and queries for more advanced analytics.
- Integrate with other internal tools that need consistent, structured flight data.
