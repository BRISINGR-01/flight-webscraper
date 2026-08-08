import { useCallback, useEffect, useMemo, useState } from "react";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ErrorPage } from "../components/ErrorPage";
import { Loader } from "../components/Loader";
import { useToast } from "../components/ToastProvider";
import { TripList } from "../components/TripList";
import { API, getErrorMessage } from "../utils";
import { TripCtx, TripCtxWithId } from "../types";

export function TripManagerPage() {
  const [trips, setTrips] = useState<TripCtxWithId[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTrips(await API.getTrips());
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  function handleSelectTrip(tripId: string) {
    setSelectedTripId(tripId);
    window.localStorage.setItem("lastTripId", tripId);
    navigate(`/trips/${tripId}/prices`);
  }

  async function handleDeleteTrip(tripId: string) {
    if (!confirm("Delete this trip?")) return;
    try {
      await API.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => String(t.id) !== tripId));
      if (selectedTripId === tripId) {
        setSelectedTripId(null);
      }
    } catch (e) {
      showToast(`Could not delete trip: ${getErrorMessage(e)}`);
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorPage message={error} onRetry={loadTrips} />;

  return (
    <Row className="m-4">
      <TripList
        trips={trips}
        selectedTripId={selectedTripId}
        onSelectTrip={handleSelectTrip}
        onDeleteTrip={handleDeleteTrip}
        onCreateTrip={() => navigate("/trips/new")}
      />
    </Row>
  );
}
