import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import InfiniteCalendar, { Calendar } from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; // Make sure to import the default stylesheet
import type { PricePoint, Trip } from "../types";
import { withPrices } from "./CalendarWithPrices";
import { Loader } from "./Loader";

const CalendarWithRange = withPrices(Calendar);

export function TripInspector({
	trip,
	pricesReturn,
	pricesDepart,
}: {
	trip: Trip;
	pricesReturn: PricePoint[];
	pricesDepart: PricePoint[];
}) {
	const [pricesByDate, setPricesByDate] = useState<Map<string, number>>(new Map());
	const [showDepart, setShowDepart] = useState(true);
	const data = showDepart ? pricesDepart : pricesReturn;
	const [disabledDates, setDisabledDates] = useState<Date[]>([]);

	useEffect(() => {
		const max = new Date();
		max.setFullYear(max.getFullYear() + 3);

		const allDates = getDates(trip.fromEarliest, trip.fromLatest);

		if (data.length === 0) {
			setDisabledDates(allDates);
			return;
		}

		const latesPrices = getLatestPrices(data);
		setPricesByDate(new Map(latesPrices.map((p) => [p.date.toDateString(), p.price])));

		const enabled = latesPrices.map(({ date }) => dateKeep_dd_mm_yy(date));
		setDisabledDates(allDates.filter((d) => !enabled.includes(d.getTime())));
	}, [data]);

	if (pricesByDate.size === 0) return <Loader />;

	return (
		<Stack>
			<div className="d-flex justify-content-between align-items-start">
				<div>
					<div className="fw-semibold">
						{trip.airline}: {trip.fromAirport} → {trip.toAirport}
					</div>
					<div className="small text-muted">
						Out: {trip.fromEarliest.toDateString()} – {trip.fromLatest.toDateString()}
						<br />
						Return: {trip.toEarliest.toDateString()} – {trip.toLatest.toDateString()}
					</div>
				</div>
			</div>
			<InfiniteCalendar
				Component={CalendarWithRange}
				pricesByDate={pricesByDate}
				displayOptions={{ showHeader: false }}
				height={innerHeight * 0.8}
				disabledDates={disabledDates}
				width={innerWidth * 0.9}
				locale={{ headerFormat: "MMM Do" }}
				min={trip.fromEarliest}
				minDate={trip.fromEarliest}
				maxDate={trip.fromLatest}
				max={trip.fromLatest}
			/>
		</Stack>
	);
}

function getDates(from: Date, to: Date) {
	const dates = [];

	let start = new Date(from);
	while (start < to) {
		dates.push(new Date(start));
		start.setDate(start.getDate() + 1);
	}

	return dates;
}

function getLatestPrices(data: PricePoint[]) {
	let latestCreateDate = dateKeep_dd_mm_yy(data.at(-1)!.createdAt);

	for (const { createdAt } of data) {
		const date = dateKeep_dd_mm_yy(createdAt);
		if (date === latestCreateDate) {
			latestCreateDate = date;
		}
	}

	const dates = [];
	for (const date of data) {
		if (dateKeep_dd_mm_yy(date.createdAt) === latestCreateDate) {
			dates.push(date);
		}
	}
	return dates;
}

function dateKeep_dd_mm_yy(date: Date) {
	return (
		date.getTime() -
		date.getMilliseconds() -
		date.getSeconds() * 1000 -
		date.getMinutes() * 60_000 -
		date.getHours() * 3_600_000
	);
}
