import { useState } from "react";
import { Button, Card, Container, Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

type AirportSelectorProps = {
	airports: string[];
	onSubmit: (from: string, to: string) => void;
};

export function AirportSelector({ airports, onSubmit }: AirportSelectorProps) {
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	const departureAirports = airports.filter((a) => a !== to);
	const returnAirports = airports.filter((a) => a !== from);

	return (
		<Container>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<Card.Title className="mb-0">Select airports</Card.Title>
					<small className="text-muted">Choose your departure and destination</small>
				</div>
			</div>

			<Form>
				<Form.Group className="mb-4">
					<Form.Label>From airport</Form.Label>
					<InputGroup className="mb-3">
						<Form.Select value={from} onChange={(e) => setFrom(e.target.value)} size="lg">
							<option value="" hidden>
								Select airport
							</option>
							{departureAirports.map((airport) => (
								<option key={airport} value={airport}>
									{airport}
								</option>
							))}
						</Form.Select>
						{from && (
							<OverlayTrigger placement="bottom" delay={500} overlay={<Tooltip>clear</Tooltip>}>
								<InputGroup.Text
									onClick={() => setFrom("")}
									aria-label="Clear selection"
									className="p-2 px-3 fs-5"
									role="button"
								>
									×
								</InputGroup.Text>
							</OverlayTrigger>
						)}
					</InputGroup>
				</Form.Group>

				<Form.Group className="mb-4">
					<Form.Label>To airport</Form.Label>
					<InputGroup>
						<Form.Select value={to} onChange={(e) => setTo(e.target.value)} size="lg">
							<option value="" hidden>
								Select airport
							</option>

							{returnAirports.map((airport) => (
								<option key={airport} value={airport}>
									{airport}
								</option>
							))}
						</Form.Select>
						{to && (
							<OverlayTrigger placement="bottom" delay={500} overlay={<Tooltip>clear</Tooltip>}>
								<InputGroup.Text
									onClick={() => setTo("")}
									aria-label="Clear selection"
									className="p-2 px-3 fs-5"
									role="button"
								>
									×
								</InputGroup.Text>
							</OverlayTrigger>
						)}
					</InputGroup>
				</Form.Group>

				<div className="d-flex justify-content-end">
					<Button onClick={() => onSubmit(from, to)} disabled={!from || !to} size="lg">
						Continue to dates
					</Button>
				</div>
			</Form>
		</Container>
	);
}
