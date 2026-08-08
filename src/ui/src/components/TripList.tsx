import { Button, Card, ListGroup } from "react-bootstrap";
import { TripCtx, TripCtxWithId } from "../types";

type TripListProps = {
  trips: TripCtxWithId[];
  selectedTripId: string | null;
  onSelectTrip: (id: string) => void;
  onDeleteTrip: (id: string) => void;
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
                active={String(trip.id) === selectedTripId}
                className="d-flex justify-content-between align-items-start"
                action
                onClick={() => onSelectTrip(String(trip.id))}
              >
                <div>
                  <div className="fw-semibold">
                    {trip.airline}: {trip.depart.airport} →{" "}
                    {trip.arrive.airport}
                  </div>
                  <div className="small text-muted">
                    Out: {trip.depart.fromDate.toDateString()} –{" "}
                    {trip.depart.toDate.toDateString()}
                    <br />
                    Return: {trip.arrive.fromDate.toDateString()} –{" "}
                    {trip.arrive.toDate.toDateString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTrip(String(trip.id));
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
