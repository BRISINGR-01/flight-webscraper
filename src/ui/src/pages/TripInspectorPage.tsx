import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { TripInspector } from "../components/TripInspector";
import type { PricePoint, Trip } from "../types";
import { API } from "../utils";

export function TripInspectorPage() {
	const { id } = useParams<{ id: string }>();
	const [trip, setTrip] = useState<Trip | null>(null);
	const [pricesReturn, setPricesReturn] = useState<PricePoint[]>([]);
	const [pricesDepart, setPricesDepart] = useState<PricePoint[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (!id) return navigate("/trips");

		API.getTrip(id).then(({ pricesDepart, pricesReturn, trip }) => {
			setTrip(trip);
			setPricesReturn(pricesReturn);
			setPricesDepart(pricesDepart);
		});
	}, []);

	if (!trip) return <Loader />;

	return (
		<Row className="m-4">
			<Col>
				<TripInspector trip={trip} pricesReturn={pricesReturn} pricesDepart={pricesDepart} />
			</Col>
		</Row>
	);
}
