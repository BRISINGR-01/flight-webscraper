import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { airportNameToCOde } from "../../../data/utils";

type AirportSelectorProps = {
  airports: string[];
  initialFrom?: string;
  initialTo?: string;
  onSubmit: (from: string, to: string) => void;
};

export function AirportSelector({
  airports,
  initialFrom,
  initialTo,
  onSubmit,
}: AirportSelectorProps) {
  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");

  const departureAirports = airports.filter((a) => a !== to);
  const returnAirports = airports.filter((a) => a !== from);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="mx-auto" style={{ maxWidth: 480 }}>
      <div className="text-center mb-4">
        <h4 className="mb-1">Where are you going?</h4>
        <p className="text-muted mb-0">
          Choose your departure and destination airports
        </p>
      </div>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="fw-semibold">From</Form.Label>
          <InputGroup>
            <Form.Select
              value={from}
              onChange={(e) => setFrom(airportNameToCOde(e.target.value))}
              size="lg"
            >
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
              <InputGroup.Text
                onClick={() => setFrom("")}
                aria-label="Clear from airport"
                role="button"
                className="p-2 px-3 fs-5"
              >
                ×
              </InputGroup.Text>
            )}
          </InputGroup>
        </Form.Group>

        <div className="d-flex justify-content-center mb-3">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={swap}
            disabled={!from && !to}
            className="rounded-pill px-3"
            aria-label="Swap airports"
          >
            ⇅ Swap
          </Button>
        </div>

        <Form.Group className="mb-4">
          <Form.Label className="fw-semibold">To</Form.Label>
          <InputGroup>
            <Form.Select
              value={to}
              onChange={(e) => setTo(airportNameToCOde(e.target.value))}
              size="lg"
            >
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
              <InputGroup.Text
                onClick={() => setTo("")}
                aria-label="Clear to airport"
                role="button"
                className="p-2 px-3 fs-5"
              >
                ×
              </InputGroup.Text>
            )}
          </InputGroup>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button
            onClick={() => onSubmit(from, to)}
            disabled={!from || !to}
            size="lg"
            className="px-4"
          >
            Continue to dates
          </Button>
        </div>
      </Form>
    </div>
  );
}
