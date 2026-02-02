# UI Flow (uiFlow.md)

Entry Flow

- User opens the app.
- The system checks for persisted choices:
  - If a **last chosen airline** exists:
    - Auto-select that airline in the UI.
  - Otherwise:
    - Prompt the user to choose an airline.
- Then:
  - If a **last chosen trip** exists for that airline:
    - Open the **trip inspector** for that trip.
  - Otherwise:
    - Open the **trip manager**.

Trip Manager

- Purpose: overview and management of trips.
- Capabilities:
  - **Open trip**: navigate to the inspector for that trip.
  - **Delete trip**: remove a trip.
  - **Create trip**: go to the trip creator view.

Trip Creator (single page)

- Inputs:
  - **Departure (from) airport**.
  - **Return (to) airport**.
  - **Departure date range**: from–to.
  - **Return date range**: from–to with restraints based on departure.
- Behaviour:
  - All date fields are edited on a single page.
  - On **Save**:
    - Validate date rules, including **earliest return ≥ earliest departure + 1 day**.
    - Persist the trip.
    - Navigate to the **trip inspector** for the new trip and treat it as the “last chosen trip”.

Trip Inspector

- Purpose: deep dive into a single trip.
- Behaviour:
  - Display a **chart** showing how prices have progressed over time (crypto-style line chart).
  - Display the **current lowest price** for this trip (as computed by the backend).
  - When the user leaves and later reopens the app, this trip should be the default “last chosen trip” (subject to airline selection).
