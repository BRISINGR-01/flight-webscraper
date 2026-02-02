Decision Log (60-decisions.md)

2026-02-02 – Introduced Trip model and API for UI integration
- **Context**:
  - Original project scraped Ryanair prices into a `DatePrice` table but had no higher-level concept of trips or a user-facing interface.
  - New requirement: allow users to choose airline, define trips (airport/date ranges), and visualise prices over time like a crypto chart, including the cheapest current price.
- **Options considered**:
  - A) Keep only `DatePrice` and compute trips on-the-fly in the UI.
  - B) Add an application-level `Trip` concept and persist trips in the DB.
  - C) Persist everything only in frontend state without DB changes.
- **Decision**:
  - Chose **Option B**: introduce a `Trip` Sequelize model and back it with a Bun HTTP API.
- **Rationale**:
  - Trips are a core domain concept (user-managed units of comparison) and should be persistent and queryable.
  - Backend orchestration (Bun server) makes it easier to reuse the same data for different UIs or scripts.
  - Avoids pushing complex date-window logic and persistence into the frontend.
- **Impact**:
  - DB schema extended with `Trip`.
  - API endpoints added: `/airlines`, `/trips`, `/trips/:id/prices`, etc.
  - Frontend now depends on this API for trip management and price history.

2026-02-02 – Enforced earliest-return-after-earliest-depart rule in both backend and frontend
- **Context**:
  - Requirement: “the earliest return should be at least a day after the earliest depart”.
  - Needed to avoid invalid or nonsensical round-trip windows.
- **Decision**:
  - Implemented validation in:
    - Backend (`POST /trips`): rejects any trip where `toEarliest < fromEarliest + 1 day`.
    - Frontend (`App.tsx`): shows a validation error and prevents submission if the rule is violated.
- **Rationale**:
  - Double enforcement ensures robustness:
    - Backend remains the single source of truth.
    - Frontend gives immediate feedback and reduces failed API calls.
- **Impact**:
  - API clients must respect this constraint for trip creation.
  - UI clearly communicates the constraint to users.

2026-02-02 – Chose Vite + React-Bootstrap + Recharts for the UI
- **Context**:
  - Need a “crypto-style” chart and a modern but straightforward UI to manage trips.
- **Options considered**:
  - A) Pure React with custom CSS and a low-level chart library (D3).
  - B) React with React-Bootstrap for layout/components and a dedicated chart lib like Recharts.
  - C) A non-React SPA framework.
- **Decision**:
  - Chose **Option B**: Vite + React + React-Bootstrap + Recharts.
- **Rationale**:
  - React-Bootstrap accelerates building a clean, responsive layout.
  - Recharts provides declarative charts with minimal boilerplate and good defaults.
  - Vite offers fast dev experience and integrates well with TypeScript.
- **Impact**:
  - UI lives in `ui/` with its own toolchain.
  - Any future visualisations can be built on top of Recharts.


