import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/style.css";

export function DateRangePicker(props: {
  after?: Date;
  selected?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  title?: string;
  subtitle?: string;
}) {
  const minDate = new Date(props.after ?? new Date());
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 3);

  return (
    <div>
      {(props.title || props.subtitle) && (
        <div className="text-center mb-2">
          {props.title && <h5 className="mb-1">{props.title}</h5>}
          {props.subtitle && (
            <p className="text-muted mb-0 small">{props.subtitle}</p>
          )}
        </div>
      )}

      <div className="d-flex justify-content-center">
        <DayPicker
          mode="range"
          numberOfMonths={1}
          pagedNavigation
          selected={props.selected}
          onSelect={props.onSelect}
          disabled={{ before: minDate, after: maxDate }}
          defaultMonth={props.selected?.from ?? minDate}
        />
      </div>

      <div className="text-center text-muted small mt-1">
        {props.selected?.from && props.selected.to
          ? `${formatDate(props.selected.from)} – ${formatDate(props.selected.to)}`
          : "Pick a range of days"}
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
