# Progress (progress.md)

What Works

- Scraper:
  - Puppeteer flow extracts daily prices from Ryanair and writes `DatePrice` rows.
- Data & API:
  - SQLite + Sequelize models for `DatePrice` and `Trip`.
  - Bun HTTP API exposes airlines, trips, price history, and cheapest current price.
  - Business rules (including earliest-return-after-earliest-depart) enforced on the server.
- UI:
  - React-Bootstrap interface for:
    - Selecting airline.
    - Creating/deleting/selecting trips with validated date ranges.
    - Viewing crypto-style price history charts and the cheapest current price per trip.

What’s Left to Build / Improve

- Scraper orchestration and UX:
  - A more explicit mechanism to run scrapes for specific trips or schedules.
  - Better feedback in logs about which trips/routes have fresh data.
- Additional analytics:
  - Outbound vs return price breakdowns.
  - Basic statistics: averages, volatility, or alerts for price drops.

Current Status

- End-to-end path is functional:
  - Scrape → DB → API → UI.
- System is suitable for **local, developer-focused use** and experimentation with trips and price history.

Known Issues / Considerations

- Fragility to Ryanair UI changes:
  - DOM/selector changes can break scraping without affecting the API or UI directly, potentially leading to stale data.
- No authentication or multi-user support:
  - Assumes a trusted local environment.
- Limited error surfacing in UI:
  - Some backend errors are surfaced as generic messages; could be made more descriptive over time.
