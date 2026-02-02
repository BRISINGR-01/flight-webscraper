import { useEffect, useMemo, useState } from "react";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TripList } from "../components/TripList";
import type { Trip } from "../types";

const API_BASE = "http://localhost:3001";

export function TripManagerPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrips() {
      const res = await fetch(`${API_BASE}/trips`);
      const json = await res.json().catch(() => ({ trips: [] }));
      const existingTrips: Trip[] = json.trips ?? [];
      setTrips(existingTrips);
    }

    loadTrips().catch(console.error);
  }, []);

  const sortedTrips = useMemo(
    () =>
      [...trips].sort((a, b) => {
        if (a.fromAirport !== b.fromAirport) return a.fromAirport.localeCompare(b.fromAirport);
        if (a.toAirport !== b.toAirport) return a.toAirport.localeCompare(b.toAirport);
        return a.id - b.id;
      }),
    [trips],
  );

  function handleSelectTrip(tripId: number) {
    setSelectedTripId(tripId);
    window.localStorage.setItem("lastTripId", String(tripId));
    navigate(`/trips/${tripId}`);
  }

  async function handleDeleteTrip(tripId: number) {
    if (!confirm("Delete this trip?")) return;
    await fetch(`${API_BASE}/trips/${tripId}`, { method: "DELETE" });
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (selectedTripId === tripId) {
      setSelectedTripId(null);
    }
  }

  return (
    <Row className="m-4">
      <TripList
        trips={sortedTrips}
        selectedTripId={selectedTripId}
        onSelectTrip={handleSelectTrip}
        onDeleteTrip={handleDeleteTrip}
        onCreateTrip={() => navigate("/trips/new")}
      />
    </Row>
  );
}


