import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TripCreator } from "../components/TripCreator";
import { API } from "../utils";

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
	const [airports, setAirports] = useState<string[]>([]);

	useEffect(() => {
		API.getAirports().then((res) => setAirports(res));
	}, []);

	const navigate = useNavigate();

	async function handleSubmit(data: {
		airports: { from: string; to: string };
		dates: {
			from: { earliest: Date; latest: Date };
			to: { earliest: Date; latest: Date };
		};
	}) {
		const res = await API.createTrip(
			selectedAirline,
			data.airports.from,
			data.airports.to,
			data.dates.from.earliest,
			data.dates.from.latest,
			data.dates.to.earliest,
			data.dates.to.latest,
		);
		if (!res.ok) {
			const err = await res.json().catch(() => ({}));
			return;
		}

		const id = await res.text();
		window.localStorage.setItem("lastTripId", id);
		navigate(`/trips/${id}`);
	}

	return <TripCreator airports={airports} onSubmit={handleSubmit} onBack={() => navigate(-1)} />;
}
