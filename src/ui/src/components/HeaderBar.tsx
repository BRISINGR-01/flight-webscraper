import { Col, Container, Form, Row } from "react-bootstrap";

type HeaderBarProps = {
  airlines: string[];
  selectedAirline: string;
  onAirlineChange: (airline: string) => void;
};

export function HeaderBar({ airlines, selectedAirline, onAirlineChange }: HeaderBarProps) {
  return (
    <Container fluid className="mb-4">
      <Row>
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="mb-1">Ryanair Price Tracker</h1>
              <p className="text-muted mb-0">
                Track trip prices over time, like a crypto chart, with strict date rules.
              </p>
            </div>
            <div>
              <Form.Label className="fw-semibold me-2 mb-0">Airline</Form.Label>
              <Form.Select
                size="sm"
                style={{ minWidth: 180 }}
                value={selectedAirline}
                onChange={(e) => onAirlineChange(e.target.value)}
              >
                {airlines.length === 0 && <option value="">No airlines detected yet</option>}
                {airlines.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}


