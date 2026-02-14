import format from "date-fns/format";
import { withDefaultProps } from "react-infinite-calendar/lib/Calendar";
import { sanitizeDate, withImmutableProps } from "react-infinite-calendar/lib/utils";
import { compose, withProps, withPropsOnChange, withState } from "recompose";

export const enhanceDay = (DayComponent: any, pricesByDate: Map<string, number>) =>
	withPropsOnChange(["selected"], (props: any) => {
		const price = pricesByDate.get(new Date(props.currentYear, props.month, props.day).toDateString());
		return {
			isSelected: props.selected === props.date,
			day:
				!price || props.selected === props.date ? (
					props.day
				) : (
					<div
						style={{ all: "unset" }}
						className="d-flex flex-column position-relative justify-content-center align-items-center"
					>
						{props.day === 1 && (
							<div
								className="position-absolute top-0"
								style={{
									fontSize: "0.8rem",
									lineHeight: "normal",
									color: "#6b6b6bff",
									transform: "translateY(calc(-4px + 50%))",
								}}
							>
								{props.monthShort}
							</div>
						)}
						<div style={{}}>{props.day}</div>
						<div
							className="position-absolute bottom-0"
							style={{
								fontSize: "0.8rem",
								lineHeight: "normal",
								color: "#053b69",
								transform: "translateY(calc(2px - 50%))",
							}}
						>
							{price}€
						</div>
					</div>
				),
		};
	})(DayComponent);

// Enhancer to handle selecting and displaying a single date
export const withPrices = compose(
	withDefaultProps,
	withImmutableProps((props: any) => ({
		DayComponent: enhanceDay(props.DayComponent, props.pricesByDate),
	})),
	withState("scrollDate", "setScrollDate", (props: any) => props.selected || new Date()),
	withProps(({ onSelect, setScrollDate, ...props }: any) => {
		const selected = sanitizeDate(props.selected, props);

		return {
			passThrough: {
				Day: {
					onClick: onSelect,
				},
			},
			selected: selected && format(selected, "YYYY-MM-DD"),
		};
	}),
);
