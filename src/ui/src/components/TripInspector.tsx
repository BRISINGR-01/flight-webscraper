import { useEffect, useMemo, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { DayPicker } from "react-day-picker";
import type { DayButtonProps } from "react-day-picker";
import "react-day-picker/style.css";
import "../styles.css";
import type { PricePoint, TripCtx } from "../types";
import { Loader } from "./Loader";
import PriceChart from "./PricesChart";

export function TripInspector({
  trip,
  pricesReturn,
  pricesDepart,
}: {
  trip: TripCtx;
  pricesReturn: PricePoint[];
  pricesDepart: PricePoint[];
}) {
  const [selection, setSelection] = useState<
    | {
        date: Date;
        data: PricePoint[];
      }
    | undefined
  >(undefined);

  const depart = useMemo(
    () =>
      buildCalendarData(pricesDepart, trip.depart.fromDate, trip.depart.toDate),
    [pricesDepart, trip],
  );
  const ret = useMemo(
    () =>
      buildCalendarData(pricesReturn, trip.depart.fromDate, trip.arrive.toDate),
    [pricesReturn, trip],
  );

  if (depart.pricesByDate.size === 0 && ret.pricesByDate.size === 0)
    return <Loader />;

  console.log(trip);

  return (
    <Stack>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-semibold">
            {trip.airline}: {trip.depart.airport} → {trip.arrive.airport}
          </div>
          <div className="small text-muted">
            Out: {trip.depart.fromDate.toDateString()} –{" "}
            {trip.depart.toDate.toDateString()}
            <br />
            Return: {trip.depart.fromDate.toDateString()} –{" "}
            {trip.arrive.toDate.toDateString()}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-xl-row gap-4 justify-content-center">
        <PriceCalendar
          title="Outbound prices"
          pricesByDate={depart.pricesByDate}
          disabledDates={depart.disabledDates}
          range={{ earliest: trip.depart.fromDate, latest: trip.depart.toDate }}
          priceClass="rdp-price-depart"
          selected={selection?.date}
          onSelect={(date) =>
            setSelection(date ? { date, data: pricesDepart } : undefined)
          }
        />
        <PriceCalendar
          title="Return prices"
          pricesByDate={ret.pricesByDate}
          disabledDates={ret.disabledDates}
          range={{ earliest: trip.depart.fromDate, latest: trip.arrive.toDate }}
          priceClass="rdp-price-return"
          selected={selection?.date}
          onSelect={(date) =>
            setSelection(date ? { date, data: pricesReturn } : undefined)
          }
        />
      </div>

      {selection && <PriceChart date={selection.date} data={selection.data} />}
    </Stack>
  );
}

function PriceCalendar(props: {
  title: string;
  pricesByDate: Map<string, number>;
  disabledDates: Date[];
  range: { earliest: Date; latest: Date };
  priceClass: string;
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
}) {
  const {
    title,
    pricesByDate,
    disabledDates,
    range,
    priceClass,
    selected,
    onSelect,
  } = props;

  const DayButton = useMemo(
    () => (buttonProps: DayButtonProps) => (
      <PriceDayButton
        {...buttonProps}
        pricesByDate={pricesByDate}
        priceClass={priceClass}
      />
    ),
    [pricesByDate, priceClass],
  );

  console.log(range, selected);

  return (
    <div className="flex-grow-1">
      <div className="text-center fw-semibold mb-2">{title}</div>
      <div className="d-flex justify-content-center">
        <DayPicker
          className="prices-calendar"
          mode="single"
          numberOfMonths={1}
          pagedNavigation
          selected={selected}
          onSelect={onSelect}
          disabled={[
            { before: range.earliest, after: range.latest },
            ...disabledDates,
          ]}
          defaultMonth={range.earliest}
          components={{ DayButton }}
        />
      </div>
    </div>
  );
}

function PriceDayButton(
  props: DayButtonProps & {
    pricesByDate: Map<string, number>;
    priceClass: string;
  },
) {
  const { day, modifiers, children, pricesByDate, priceClass, ...buttonProps } =
    props;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const price = pricesByDate.get(day.date.toDateString());

  return (
    <button ref={ref} {...buttonProps}>
      <span className="d-flex flex-column align-items-center justify-content-center">
        {children}
        {price !== undefined && (
          <span className={`rdp-price ${priceClass}`}>{price}€</span>
        )}
      </span>
    </button>
  );
}

function buildCalendarData(data: PricePoint[], earliest: Date, latest: Date) {
  if (data.length === 0) {
    return {
      pricesByDate: new Map<string, number>(),
      disabledDates: getDates(earliest, latest),
    };
  }

  const latesPrices = getLatestPrices(data);
  const pricesByDate = new Map(
    latesPrices.map((p) => [p.date.toDateString(), p.price]),
  );

  const enabled = latesPrices.map(({ date }) => date.toDateString());
  const disabledDates = getDates(earliest, latest).filter(
    (d) => !enabled.includes(d.toDateString()),
  );

  return { pricesByDate, disabledDates };
}

function getDates(from: Date, to: Date) {
  const dates = [];

  let start = new Date(from);
  while (start < to) {
    dates.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return dates;
}

function getLatestPrices(data: PricePoint[]) {
  let latestCreateDate = data.at(-1)!.createdAt.toDateString();

  for (const { createdAt } of data) {
    const date = createdAt.toDateString();
    if (date === latestCreateDate) {
      latestCreateDate = date;
    }
  }

  const dates = [];
  for (const date of data) {
    if (date.createdAt.toDateString() === latestCreateDate) {
      dates.push(date);
    }
  }
  return dates;
}
