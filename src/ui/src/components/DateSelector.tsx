import { useState } from "react";
import { Button } from "react-bootstrap";
import InfiniteCalendar, { Calendar, withRange } from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; // Make sure to import the default stylesheet

const CalendarWithRange = withRange(Calendar);

export function DateSelector(props: {
	onSubmit: (earliest: Date, latest: Date) => void;
	after?: Date;
	initialEarliest?: Date;
	initialLatest?: Date;
	title?: string;
	subtitle?: string;
}) {
	const minDate = new Date(props.after ?? new Date());
	minDate.setDate(minDate.getDate() + 1);

	const clamp = (d: Date) => (d < minDate ? new Date(minDate) : new Date(d));

	const [earliest, setEarliest] = useState<Date>(() =>
		props.initialEarliest ? clamp(props.initialEarliest) : new Date(minDate),
	);
	const [latest, setLatest] = useState<Date>(() =>
		props.initialLatest ? clamp(props.initialLatest) : new Date(minDate),
	);

	const max = new Date();
	max.setFullYear(max.getFullYear() + 3);

	return (
		<div className="mx-auto d-flex flex-column align-items-center">
			{(props.title || props.subtitle) && (
				<div className="text-center mb-3">
					{props.title && <h4 className="mb-1">{props.title}</h4>}
					{props.subtitle && <p className="text-muted mb-0">{props.subtitle}</p>}
				</div>
			)}

			<InfiniteCalendar
				Component={CalendarWithRange}
				selected={{ start: earliest, end: latest }}
				onSelect={({ end, start }: { start: Date; end: Date }) => {
					setEarliest(start);
					setLatest(end);
				}}
				displayOptions={{ layout: "landscape" }}
				height={Math.min(window.innerHeight * 0.6, 480)}
				width={Math.min(window.innerWidth * 0.95, 600)}
				min={minDate}
				minDate={minDate}
				maxDate={max}
				max={max}
				locale={{ headerFormat: "MMM Do" }}
			/>

			<div className="d-flex justify-content-center pt-3">
				<Button
					variant="outline-primary"
					onClick={() => props.onSubmit(earliest, latest)}
					disabled={!earliest || !latest}
					size="lg"
					className="px-4"
				>
					Save dates
				</Button>
			</div>
		</div>
	);
}
