import { Alert, Badge, Card, Spinner } from "react-bootstrap";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PricePoint, Trip } from "../types";

type TripInspectorProps = {
  activeTrip: Trip | null;
  priceData: PricePoint[];
  cheapest: PricePoint | null;
  loadingPrices: boolean;
  pricesError: string | null;
};

export function TripInspector({
  activeTrip,
  priceData,
  cheapest,
  loadingPrices,
  pricesError,
}: TripInspectorProps) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Card.Title className="mb-0">
              {activeTrip
                ? `Trip inspector: ${activeTrip.fromAirport} → ${activeTrip.toAirport}`
                : "Trip inspector"}
            </Card.Title>
            <small className="text-muted">
              Explore historical prices and the current lowest price for a selected trip.
            </small>
          </div>
          {activeTrip && (
            <Badge bg="light" text="secondary">
              {activeTrip.fromEarliest} – {activeTrip.toLatest}
            </Badge>
          )}
        </div>

        {loadingPrices && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" role="status" className="me-2" />
            <span>Loading price data…</span>
          </div>
        )}

        {!loadingPrices && pricesError && (
          <Alert variant="danger" className="mb-3">
            {pricesError}
          </Alert>
        )}

        {!loadingPrices && !pricesError && activeTrip && priceData.length === 0 && (
          <p className="text-muted mb-0">
            No price history found for this trip yet. Run the scraper to collect data.
          </p>
        )}

        {!loadingPrices && !pricesError && priceData.length > 0 && (
          <>
            {cheapest && (
              <Alert variant="success" className="mb-3">
                <div className="fw-semibold mb-1">Cheapest current price</div>
                <div className="mb-0">
                  {cheapest.price.toFixed(2)} on {cheapest.date}
                </div>
              </Alert>
            )}

            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#0d6efd"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {!activeTrip && (
          <p className="text-muted mb-0">
            Select a trip in the list to inspect its price history and cheapest current price.
          </p>
        )}
      </Card.Body>
    </Card>
  );
}


