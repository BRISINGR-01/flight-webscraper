import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TripCreator } from "../components/TripCreator";

const API_BASE = "http://localhost:3001";

type TripCreatorPageProps = {
  selectedAirline: string;
};

function toISO(value: string) {
  return value;
}

function addDaysStr(value: string, days: number) {
  const d = new Date(value + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function TripCreatorPage({ selectedAirline }: TripCreatorPageProps) {
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [fromEarliest, setFromEarliest] = useState("");
  const [fromLatest, setFromLatest] = useState("");
  const [toEarliest, setToEarliest] = useState("");
  const [toLatest, setToLatest] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!selectedAirline || !fromAirport || !toAirport) {
      setFormError("Airline, from airport and to airport are required");
      return;
    }

    if (!fromEarliest || !fromLatest || !toEarliest || !toLatest) {
      setFormError("All date fields are required");
      return;
    }

    const fromEarliestIso = toISO(fromEarliest);
    const toEarliestIso = toISO(toEarliest);

    const minReturn = addDaysStr(fromEarliestIso, 1);
    if (toEarliestIso < minReturn) {
      setFormError("Earliest return must be at least one day after earliest departure");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          airline: selectedAirline,
          fromAirport: fromAirport.toUpperCase(),
          toAirport: toAirport.toUpperCase(),
          fromEarliest: fromEarliestIso,
          fromLatest: toISO(fromLatest),
          toEarliest: toEarliestIso,
          toLatest: toISO(toLatest),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setFormError(err.error ?? "Failed to create trip");
        return;
      }

      const created = await res.json();
      const id = created.id as number;
      window.localStorage.setItem("lastTripId", String(id));
      navigate(`/trips/${id}`);

      setFromAirport("");
      setToAirport("");
      setFromEarliest("");
      setFromLatest("");
      setToEarliest("");
      setToLatest("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TripCreator
      fromAirport={fromAirport}
      toAirport={toAirport}
      fromEarliest={fromEarliest}
      fromLatest={fromLatest}
      toEarliest={toEarliest}
      toLatest={toLatest}
      formError={formError}
      loading={loading}
      onChangeFromAirport={setFromAirport}
      onChangeToAirport={setToAirport}
      onChangeFromEarliest={setFromEarliest}
      onChangeFromLatest={setFromLatest}
      onChangeToEarliest={setToEarliest}
      onChangeToLatest={setToLatest}
      onSubmit={handleSubmit}
      onBack={() => navigate(-1)}
    />
  );
}

