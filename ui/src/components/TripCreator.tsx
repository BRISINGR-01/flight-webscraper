import { useState } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import { AirportSelector } from "./AirportSelector";
import { DateSelector } from "./DateSelector";

type TripCreatorProps = {
	airports: string[];
	onSubmit: (data: {
		airports: { from: string; to: string };
		dates: {
			from: { earliest: Date; latest: Date };
			to: { earliest: Date; latest: Date };
		};
	}) => void;
	onBack: () => void;
};

export function TripCreator(props: TripCreatorProps) {
	const [airports, setAirports] = useState<{ from: string; to: string } | null>({
		from: "SOF",
		to: "EIN",
	});
	const [dates, setDates] = useState<{
		from: { earliest: Date; latest: Date } | null;
		to: { earliest: Date; latest: Date } | null;
	}>({ from: null, to: null });

	const pageContent: JSX.Element[] = [];

	if (!airports) {
		return (
			<ContentWrapper onBack={props.onBack}>
				<AirportSelector key="airports" airports={props.airports} onSubmit={(from, to) => setAirports({ from, to })} />
			</ContentWrapper>
		);
	}

	pageContent.push(
		<AirportsDisplay key="airports" from={airports.from} to={airports.to} onClear={() => setAirports(null)} />,
	);

	if (!dates.from) {
		return (
			<ContentWrapper onBack={props.onBack}>
				{pageContent}
				<DateSelector
					key="from-selector"
					onSubmit={(earliest, latest) => {
						setDates((prev) => ({ ...prev, from: { earliest, latest } }));
					}}
				/>
			</ContentWrapper>
		);
	}

	pageContent.push(
		<DatesDisplay
			key="dates-d"
			isDeparture
			from={dates.from.earliest}
			to={dates.from.latest}
			onClear={() => setDates(() => ({ to: null, from: null }))}
		/>,
	);

	if (!dates.to) {
		return (
			<ContentWrapper onBack={props.onBack}>
				{pageContent}
				<DateSelector
					key="to-selector"
					onSubmit={(earliest, latest) => setDates((prev) => ({ ...prev, to: { earliest, latest } }))}
					after={dates.from.earliest}
				/>
			</ContentWrapper>
		);
	}

	pageContent.push(
		<DatesDisplay
			key="dates-r"
			from={dates.to.earliest}
			to={dates.to.latest}
			onClear={() =>
				setDates((prev) => ({
					...prev,
					to: null,
				}))
			}
		/>,
	);

	return (
		<ContentWrapper onBack={props.onBack}>
			{pageContent}
			<Button
				onClick={() =>
					props.onSubmit({
						airports,
						dates: dates as {
							from: { earliest: Date; latest: Date };
							to: { earliest: Date; latest: Date };
						},
					})
				}
				size="lg"
			>
				Create trip
			</Button>
		</ContentWrapper>
	);
}

function ContentWrapper(props: { onBack: () => void; children: JSX.Element | JSX.Element[] | any }) {
	return (
		<>
			<Button variant="secondary" onClick={props.onBack} className="top-0 mt-3 z-2 position-fixed">
				← Back
			</Button>
			<Row>
				<Col lg={6}>
					<Stack className="align-items-center">{props.children}</Stack>
				</Col>
			</Row>
		</>
	);
}

function AirportsDisplay(props: { from: string; to: string; onClear: () => void }) {
	return (
		<Stack
			direction="horizontal"
			key="airports"
			className="mb-3 d-flex align-items-center justify-content-between p-3 bg-light rounded w-100"
		>
			<div></div>
			<Stack direction="horizontal" className="align-items-center" gap={3}>
				<div className="text-center">
					<small className="text-muted d-block">From</small>
					<strong className="fs-5">{props.from}</strong>
				</div>
				<span className="text-muted">→</span>
				<div className="text-center">
					<small className="text-muted d-block">To</small>
					<strong className="fs-5">{props.to}</strong>
				</div>
			</Stack>
			<Button variant="outline-secondary" size="sm" onClick={props.onClear}>
				Change
			</Button>
		</Stack>
	);
}

function DatesDisplay(props: { isDeparture?: boolean; from: Date; to: Date; onClear: () => void }) {
	return (
		<Col xs={12} md={7}>
			<Stack
				direction="horizontal"
				className="mb-3 d-flex align-items-center justify-content-between p-3 bg-light rounded w-100"
			>
				<div></div>

				<Stack className="flex-grow-0">
					<h6 className="mb-0">{props.isDeparture ? "Departure" : "Returning"} Dates</h6>
					<Stack direction="horizontal" className="justify-content-cen ter" gap={3}>
						<div className="fw-semibold">
							{props.from.toLocaleDateString()} → {props.to.toLocaleDateString()}
						</div>
					</Stack>
				</Stack>
				<Button variant="outline-secondary" size="sm" onClick={props.onClear}>
					Change
				</Button>
			</Stack>
		</Col>
	);
}
