Project Brief (projectbrief.md)

Role in Memory System
- Acts as a **concise foundation document** that brings together the essentials from `00-description.md` and `01-brief.md`.
- Used as a quick, human-readable entry point for understanding **what this project is and why it exists**.

Core Idea
- Build a **Ryanair flight price tracking system** that:
  - Scrapes price data from Ryanair using Puppeteer.
  - Stores prices in a SQLite database via Sequelize.
  - Exposes a Bun-based HTTP API to query airlines, trips, and price history.
  - Provides a React-Bootstrap UI where users define trips (airline + airports + date ranges) and visualise price changes over time like a crypto chart, including the current cheapest price.

Goals & Scope
- **Goals**:
  - Automate collection of flight prices for specific routes and date windows.
  - Make historical and current prices easy to explore, compare, and reason about.
  - Keep the implementation relatively small, maintainable, and easy to extend.
- **In Scope**:
  - Scraping flight prices from public Ryanair web pages.
  - Persisting price points and user-defined trips.
  - Providing an API + UI for trip management and price visualisation.
- **Out of Scope (for now)**:
  - Large-scale, multi-node scraping infrastructure.
  - Public production deployment with authentication and multi-tenant access.
  - Full analytics/BI layer beyond the basic charts and cheapest-price indicators.


