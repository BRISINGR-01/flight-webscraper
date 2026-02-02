# Product Context (productContext.md)

Why This Project Exists

- Repeatedly checking Ryanair flight prices manually is slow, error-prone, and does not scale.
- Users want a way to **track price movements over time**, not just see today’s snapshot.
- This project provides an automated, developer-friendly way to collect and analyse Ryanair price data.

Problems It Solves

- Eliminates manual, repetitive web browsing just to check “has this flight gotten cheaper?”.
- Captures **historical price curves** so users can see trends, not just point-in-time prices.
- Provides a structured model (`Trip`) so users can reason in terms of “a trip I care about” rather than individual scrape runs.

How It Should Work (Conceptually)

- User (or a scheduled job) runs the scraper to populate `DatePrice` records for a set of routes and dates.
- User defines **trips** via the UI, specifying:
  - Airline.
  - From and to airports.
  - Outbound and return date windows.
- The system then:
  - Aggregates underlying `DatePrice` data for each trip.
  - Exposes it through the API as price history plus the cheapest current price.
  - Visualises it as a crypto-style chart for easy comparison over months.

User Experience Goals

- **Simple trip creation**:
  - Clear form fields for airline, airports, and date ranges.
  - Immediate validation errors for invalid rules (e.g., earliest return too early).
- **Fast insight**:
  - At-a-glance view of the cheapest current price for a trip.
  - Smooth chart of historical prices to see trends and volatility.
- **Low friction for technical users**:
  - Easy to run locally with Bun and Vite.
  - Clear mapping between UI actions and underlying API/DB entities.

High-Level UI Flow (Summary)

- User opens the app:
  - If there is a **last chosen airline**, it is auto-selected; otherwise the user must pick an airline.
  - If there is a **last chosen trip**, the app opens directly in the **trip inspector** for that trip; otherwise it shows the **trip manager**.
- Trip manager:
  - List existing trips; allow **open**, **delete**, and **create** actions.
- Trip creator (on a single page):
  - Choose **departure (from) airport** and **return (to) airport** on entry page.
  - Choose **departure date range** (from–to) and **return date range** (from–to) on the same screen.
  - Save trip → navigate to the **trip inspector** for the newly created trip.
- Trip inspector:
  - Show a chart of how prices progress over time for the selected trip.
  - Show the **current lowest price** for that trip.
