import { useEffect, useMemo, useState } from "react";
import { Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { TripList } from "../components/TripList";
import type { Trip } from "../types";
import { API } from "../utils";

export function TripManagerPage() {
	const [trips, setTrips] = useState<Trip[]>([]);
	const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		async function loadTrips() {
			setTrips(await API.getTrips());
		}

		loadTrips();
	}, []);

	const sortedTrips = useMemo(
		() =>
			[...trips].sort((a, b) => {
				if (a.fromAirport !== b.fromAirport) return a.fromAirport.localeCompare(b.fromAirport);
				if (a.toAirport !== b.toAirport) return a.toAirport.localeCompare(b.toAirport);
				return 0;
			}),
		[trips],
	);

	function handleSelectTrip(tripId: string) {
		setSelectedTripId(tripId);
		window.localStorage.setItem("lastTripId", tripId);
		navigate(`/trips/${tripId}`);
	}

	async function handleDeleteTrip(tripId: string) {
		if (!confirm("Delete this trip?")) return;
		await API.deleteTrip(tripId);
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
