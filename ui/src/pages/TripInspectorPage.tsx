import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { TripInspector } from "../components/TripInspector";
import type { PriceHistoryResponse, PricePoint, Trip } from "../types";

const API_BASE = "http://localhost:3001";

export function TripInspectorPage() {
  const { id } = useParams<{ id: string }>();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [cheapest, setCheapest] = useState<PricePoint | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [pricesError, setPricesError] = useState<string | null>(null);

  const tripId = id ? Number(id) : NaN;

  useEffect(() => {
    async function loadTrips() {
      const res = await fetch(`${API_BASE}/trips`);
      const json = await res.json().catch(() => ({ trips: [] }));
      const existingTrips: Trip[] = json.trips ?? [];
      setTrips(existingTrips);
    }

    loadTrips().catch(console.error);
  }, []);

  const activeTrip = useMemo(
    () => (Number.isFinite(tripId) ? trips.find((t) => t.id === tripId) ?? null : null),
    [trips, tripId],
  );

  useEffect(() => {
    if (!activeTrip || !Number.isFinite(tripId)) return;

    async function loadPrices() {
      setLoadingPrices(true);
      setPricesError(null);

      try {
        const res = await fetch(`${API_BASE}/trips/${tripId}/prices`);
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setPricesError(err.error ?? "Failed to load price history");
          setPriceData([]);
          setCheapest(null);
          return;
        }

        const data: PriceHistoryResponse = await res.json();
        setPriceData(data.history ?? []);
        setCheapest(data.cheapestCurrent ?? null);
      } finally {
        setLoadingPrices(false);
      }
    }

    loadPrices().catch(console.error);
  }, [activeTrip, tripId]);

  if (!Number.isFinite(tripId)) {
    return <Navigate to="/trips" replace />;
  }

  if (!activeTrip && trips.length > 0) {
    // Trip id is invalid given the loaded trips
    return <Navigate to="/trips" replace />;
  }

  return (
    <Row className="m-4">
      <Col>
        <TripInspector
          activeTrip={activeTrip ?? null}
          priceData={priceData}
          cheapest={cheapest}
          loadingPrices={loadingPrices}
          pricesError={pricesError}
        />
      </Col>
    </Row>
  );
}


