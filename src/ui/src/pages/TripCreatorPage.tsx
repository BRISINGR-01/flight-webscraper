import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorPage } from "../components/ErrorPage";
import { Loader } from "../components/Loader";
import { TripCreator } from "../components/TripCreator";
import { API, getErrorMessage } from "../utils";
import { useToast } from "../components/ToastProvider";
import { Airline } from "../../../data/utils";

type TripCreatorPageProps = {
  selectedAirline: string;
};

export function TripCreatorPage({ selectedAirline }: TripCreatorPageProps) {
  const [airports, setAirports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadAirports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAirports(await API.getAirports());
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAirports();
  }, [loadAirports]);

  if (loading) return <Loader />;
  if (error)
    return (
      <ErrorPage
        message={error}
        onRetry={loadAirports}
        onBack={() => navigate("/trips")}
      />
    );

  async function handleSubmit(data: {
    airports: { from: string; to: string };
    dates: {
      from: { earliest: Date; latest: Date };
      to: { earliest: Date; latest: Date };
    };
  }) {
    try {
      const id = await API.createTrip({
        airline: selectedAirline as Airline,
        depart: {
          airport: data.airports.from,
          fromDate: data.dates.from.earliest,
          toDate: data.dates.from.latest,
        },
        arrive: {
          airport: data.airports.to,
          fromDate: data.dates.to.earliest,
          toDate: data.dates.to.latest,
        },
      });
      window.localStorage.setItem("lastTripId", id);
      navigate(`/trips/${id}`);
    } catch (e) {
      console.log(e);

      showToast(`Could not create trip: ${getErrorMessage(e)}`);
    }
  }

  return (
    <TripCreator
      airports={airports}
      onSubmit={handleSubmit}
      onBack={() => navigate(-1)}
    />
  );
}
