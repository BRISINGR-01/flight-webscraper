import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import InfiniteCalendar, { Calendar, withRange } from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; // Make sure to import the default stylesheet

const CalendarWithRange = withRange(Calendar);

export function DateSelector(props: { onSubmit: (earliest: Date, latest: Date) => void; after?: Date }) {
	const aftertDate = new Date(props.after ?? new Date());
	aftertDate.setDate(aftertDate.getDate() + 1);

	const [earliest, setEarliest] = useState(() => aftertDate ?? new Date());
	const [latest, setLatest] = useState(() => aftertDate ?? new Date());
	const [restraints, setRestraints] = useState(() => ({
		min: aftertDate ?? new Date(),
		max: aftertDate ?? new Date(),
	}));

	useEffect(
		() =>
			setRestraints(() => {
				const max = new Date();
				max.setFullYear(max.getFullYear() + 3);
				const min = aftertDate ?? new Date();

				return { max, min };
			}),
		[],
	);

	return (
		<Form style={{ width: "min-content" }}>
			<InfiniteCalendar
				key={restraints.max.getFullYear()} // force update
				Component={CalendarWithRange}
				selected={{ start: earliest, end: latest }}
				onSelect={({ end, start }: { start: Date; end: Date }) => {
					setEarliest(start);
					setLatest(end);
				}}
				displayOptions={{ layout: "landscape" }}
				height={innerHeight * 0.7}
				min={restraints.min}
				minDate={restraints.min}
				maxDate={restraints.max}
				max={restraints.max}
				locale={{ headerFormat: "MMM Do" }}
			/>
			<div className="d-flex justify-content-center pt-3">
				<Button
					variant="outline-primary"
					onClick={() => props.onSubmit(earliest, latest)}
					disabled={!earliest || !latest}
					size="lg"
				>
					Save dates
				</Button>
			</div>
		</Form>
	);
}
