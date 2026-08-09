import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Row, Stack } from "react-bootstrap";
import type { DateRange } from "react-day-picker";
import { AirportSelector } from "./AirportSelector";
import { DateRangePicker } from "./DateRangePicker";

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

type PickedRange = { from: Date; to: Date };

const STEPS = ["Airports", "Dates", "Review"];

export function TripCreator(props: TripCreatorProps) {
  const [airports, setAirports] = useState<{ from: string; to: string } | null>(
    {
      from: "EIN",
      to: "SOF",
    },
  );
  const [outbound, setOutbound] = useState<DateRange | null>(null);
  const [returnDates, setReturnDates] = useState<DateRange | null>(null);
  const [step, setStep] = useState(1);

  const datesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (step === 1 && datesRef.current) {
      datesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const maxReached = airports ? (outbound && returnDates ? 2 : 1) : 0;

  function handleBack() {
    if (step === 0) props.onBack();
    else setStep((s) => s - 1);
  }

  let content: JSX.Element;

  switch (step) {
    case 0:
      content = (
        <AirportSelector
          airports={props.airports}
          initialFrom={airports?.from}
          initialTo={airports?.to}
          onSubmit={(from, to) => {
            setAirports({ from, to });
            setStep(1);
          }}
        />
      );
      break;
    case 1:
      content = (
        <div ref={datesRef}>
          <RouteBadge
            from={airports!.from}
            to={airports!.to}
            onEdit={() => setStep(0)}
          />
          <Row className="justify-content-center">
            <Col xs={12} lg={6} className="mb-4 mb-lg-0">
              <DateRangePicker
                title="Outbound dates"
                subtitle="Pick the range of days you'd like to depart"
                selected={outbound ?? undefined}
                onSelect={(range) => {
                  setOutbound(range ?? null);
                  if (
                    range &&
                    complete(range) &&
                    returnDates?.from &&
                    returnDates.from <= range.to
                  ) {
                    setReturnDates(null);
                  }
                }}
              />
            </Col>
            <Col xs={12} lg={6}>
              <DateRangePicker
                key={outbound?.to?.toDateString()}
                title="Return dates"
                subtitle="Pick the range of days you'd like to return"
                after={outbound?.to}
                selected={returnDates ?? undefined}
                onSelect={(range) => setReturnDates(range ?? null)}
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-center pt-3">
            <Button
              variant="outline-primary"
              size="lg"
              className="px-4"
              disabled={!complete(outbound) || !complete(returnDates)}
              onClick={() => setStep(2)}
            >
              Save dates
            </Button>
          </div>
        </div>
      );
      break;
    default:
      content = (
        <Stack className="align-items-stretch">
          <div className="text-center mb-4">
            <h4 className="mb-1">Review your trip</h4>
            <p className="text-muted mb-0">
              Everything look good? Create the trip and we'll start tracking
              prices for you.
            </p>
          </div>
          <SummaryRow
            label="Route"
            value={`${airports!.from} to ${airports!.to}`}
            onEdit={() => setStep(0)}
          />
          <SummaryRow
            label="Outbound window"
            value={formatRange(outbound)}
            onEdit={() => setStep(1)}
          />
          <SummaryRow
            label="Return window"
            value={formatRange(returnDates)}
            onEdit={() => setStep(1)}
          />
          <Button
            size="lg"
            className="mt-3 w-100"
            onClick={() =>
              props.onSubmit({
                airports: airports!,
                dates: {
                  from: toEarliestLatest(outbound),
                  to: toEarliestLatest(returnDates),
                },
              })
            }
          >
            Create trip
          </Button>
        </Stack>
      );
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <div className="text-center mb-4">
          <h2 className="mb-1">Create a new trip</h2>
          <p className="text-muted mb-0">
            Tell us where and when, and we'll track the prices for you
          </p>
        </div>

        <StepsBar current={step} maxReached={maxReached} onNavigate={setStep} />

        <Card className="shadow-sm border-0">
          <Card.Body className="p-4 p-md-5">{content}</Card.Body>
        </Card>

        <div className="mt-3">
          <Button
            variant="link"
            className="text-secondary p-0"
            onClick={handleBack}
          >
            {step === 0 ? "← Back" : "← Back to previous step"}
          </Button>
        </div>
      </Col>
    </Row>
  );
}

function StepsBar(props: {
  current: number;
  maxReached: number;
  onNavigate: (step: number) => void;
}) {
  return (
    <Stack
      direction="horizontal"
      gap={2}
      className="justify-content-center mb-4 flex-wrap"
    >
      {STEPS.map((label, i) => {
        const done = i < props.current;
        const active = i === props.current;
        const clickable = i <= props.maxReached;
        return (
          <Button
            key={label}
            size="sm"
            disabled={!clickable}
            onClick={() => props.onNavigate(i)}
            variant={
              active ? "primary" : done ? "success" : "outline-secondary"
            }
            className="rounded-pill px-3 d-inline-flex align-items-center gap-2"
          >
            <span
              className="rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{
                width: 20,
                height: 20,
                fontSize: "0.75rem",
                fontWeight: 700,
                background:
                  active || done ? "rgba(255,255,255,0.25)" : undefined,
              }}
            >
              {done ? "✓" : i + 1}
            </span>
            {label}
          </Button>
        );
      })}
    </Stack>
  );
}

function RouteBadge(props: { from: string; to: string; onEdit: () => void }) {
  return (
    <Stack
      direction="horizontal"
      gap={2}
      className="align-items-center justify-content-center flex-wrap mb-3"
    >
      <span className="fs-5 fw-bold">{props.from}</span>
      <span className="text-muted">→</span>
      <span className="fs-5 fw-bold">{props.to}</span>
      <Button
        variant="link"
        size="sm"
        className="p-0 ms-2 text-decoration-none"
        onClick={props.onEdit}
      >
        Edit route
      </Button>
    </Stack>
  );
}

function SummaryRow(props: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <Stack
      direction="horizontal"
      className="justify-content-between align-items-center p-3 bg-light rounded-3 mb-2"
    >
      <div>
        <small className="text-muted d-block">{props.label}</small>
        <span className="fw-semibold">{props.value}</span>
      </div>
      <Button variant="outline-secondary" size="sm" onClick={props.onEdit}>
        Edit
      </Button>
    </Stack>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function complete(range: DateRange | null): range is PickedRange {
  return !!range?.from && !!range.to;
}

function toEarliestLatest(range: DateRange | null): {
  earliest: Date;
  latest: Date;
} {
  const { from, to } = complete(range)
    ? range
    : { from: new Date(), to: new Date() };
  return { earliest: from, latest: to };
}

function formatRange(range: DateRange | null) {
  if (!complete(range)) return "Not set";
  return `${formatDate(range.from)} to ${formatDate(range.to)}`;
}
