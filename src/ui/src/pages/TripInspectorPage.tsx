import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorPage } from "../components/ErrorPage";
import { Loader } from "../components/Loader";
import { TripInspector } from "../components/TripInspector";
import type { PricePoint, TripCtx } from "../types";
import { API, getErrorMessage } from "../utils";

export function TripInspectorPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<TripCtx | null>(null);
  const [pricesReturn, setPricesReturn] = useState<PricePoint[]>([]);
  const [pricesDepart, setPricesDepart] = useState<PricePoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    setTrip(null);
    try {
      const data = await API.getTrip(id);
      console.log(data);

      setTrip(data.trip);
      setPricesReturn(data.pricesReturn);
      setPricesDepart(data.pricesDepart);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      navigate("/trips");
      return;
    }
    load();
  }, [id, load, navigate]);

  if (error)
    return (
      <ErrorPage
        message={error}
        onRetry={load}
        onBack={() => navigate("/trips")}
      />
    );
  if (!trip) return <Loader />;

  return (
    <Row className="m-4">
      <Col>
        <TripInspector
          trip={trip}
          pricesReturn={pricesReturn}
          pricesDepart={pricesDepart}
        />
      </Col>
    </Row>
  );
}
