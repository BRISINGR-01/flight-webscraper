import { Button, Card, ListGroup } from "react-bootstrap";
import type { Trip } from "../types";

type TripListProps = {
  trips: Trip[];
  selectedTripId: number | null;
  onSelectTrip: (id: number) => void;
  onDeleteTrip: (id: number) => void;
  onCreateTrip: () => void;
};

export function TripList({
  trips,
  selectedTripId,
  onSelectTrip,
  onDeleteTrip,
  onCreateTrip,
}: TripListProps) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">Trips</Card.Title>
          <Button size="sm" variant="primary" onClick={onCreateTrip}>
            + New trip
          </Button>
        </div>

        {trips.length === 0 && (
          <p className="text-muted mb-0">
            No trips yet. Click <strong>+ New trip</strong> to create one.
          </p>
        )}

        {trips.length > 0 && (
          <ListGroup className="flex-grow-1 overflow-auto">
            {trips.map((trip) => (
              <ListGroup.Item
                key={trip.id}
                active={trip.id === selectedTripId}
                className="d-flex justify-content-between align-items-start"
                action
                onClick={() => onSelectTrip(trip.id)}
              >
                <div>
                  <div className="fw-semibold">
                    {trip.airline}: {trip.fromAirport} → {trip.toAirport}
                  </div>
                  <div className="small text-muted">
                    Out: {trip.fromEarliest} – {trip.fromLatest}
                    <br />
                    Return: {trip.toEarliest} – {trip.toLatest}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTrip(trip.id);
                  }}
                >
                  Delete
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}


