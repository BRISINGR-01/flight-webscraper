import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";

type TripCreatorProps = {
  fromAirport: string;
  toAirport: string;
  fromEarliest: string;
  fromLatest: string;
  toEarliest: string;
  toLatest: string;
  formError: string | null;
  loading: boolean;
  onChangeFromAirport: (value: string) => void;
  onChangeToAirport: (value: string) => void;
  onChangeFromEarliest: (value: string) => void;
  onChangeFromLatest: (value: string) => void;
  onChangeToEarliest: (value: string) => void;
  onChangeToLatest: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
};

export function TripCreator({
  fromAirport,
  toAirport,
  fromEarliest,
  fromLatest,
  toEarliest,
  toLatest,
  formError,
  loading,
  onChangeFromAirport,
  onChangeToAirport,
  onChangeFromEarliest,
  onChangeFromLatest,
  onChangeToEarliest,
  onChangeToLatest,
  onSubmit,
  onBack,
}: TripCreatorProps) {
  return (
    <Row className="justify-content-center">
      <Col lg={7}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <Card.Title className="mb-0">Create trip</Card.Title>
                <small className="text-muted">
                  Choose route and date ranges on a single, focused page.
                </small>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={onBack}>
                Back to trips
              </Button>
            </div>

            <Form onSubmit={onSubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>From airport</Form.Label>
                    <Form.Control
                      value={fromAirport}
                      onChange={(e) => onChangeFromAirport(e.target.value)}
                      placeholder="AMS"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>To airport</Form.Label>
                    <Form.Control
                      value={toAirport}
                      onChange={(e) => onChangeToAirport(e.target.value)}
                      placeholder="DUB"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-2">
                <Col>
                  <h6 className="text-uppercase text-muted small mb-2">Departure window</h6>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Earliest departure</Form.Label>
                    <Form.Control
                      type="date"
                      value={fromEarliest}
                      onChange={(e) => onChangeFromEarliest(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latest departure</Form.Label>
                    <Form.Control
                      type="date"
                      value={fromLatest}
                      onChange={(e) => onChangeFromLatest(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-2">
                <Col>
                  <h6 className="text-uppercase text-muted small mb-2">
                    Return window{" "}
                    <Badge bg="light" text="secondary">
                      At least 1 day after departure
                    </Badge>
                  </h6>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Earliest return</Form.Label>
                    <Form.Control
                      type="date"
                      value={toEarliest}
                      onChange={(e) => onChangeToEarliest(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latest return</Form.Label>
                    <Form.Control
                      type="date"
                      value={toLatest}
                      onChange={(e) => onChangeToLatest(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {formError && (
                <Alert variant="danger" className="mb-3">
                  {formError}
                </Alert>
              )}

              <div className="d-flex justify-content-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" role="status" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    "Save trip"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}


