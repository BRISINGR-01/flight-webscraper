import type { Page } from "puppeteer";

export class FlightCtx {
	public airport: string;
	public earliest: Date;
	public latest: Date;

	constructor(airport: string, earliest: Date, latest: Date) {
		this.airport = airport;
		this.earliest = earliest;
		this.latest = latest;
	}
}

export class Ctx {
	public url: string;
	public airline: Airline;
	public from: FlightCtx;
	public to: FlightCtx;
	public page: Page;

	constructor(url: string, airline: Airline, from: FlightCtx, to: FlightCtx, page: Page) {
		this.airline = airline;
		this.url = url;
		this.from = from;
		this.to = to;
		this.page = page;
	}
}

export enum DateFormatters {
	Ryanair,
	Human,
}

export function formatDate(date: Date, format: DateFormatters) {
	switch (format) {
		case DateFormatters.Ryanair:
			return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		case DateFormatters.Human:
		default:
			return `${date.getDate()} ${getMonth(date)} ${date.getFullYear()}`;
	}
}

function getMonth(date: Date) {
	return date.toString().split(" ")[1];
}

export function getMonthLables(start: Date, end: Date) {
	const months = [];

	for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
		const beginingMonth = start.getFullYear() === year ? start.getMonth() : 0;
		const endMonth = end.getFullYear() === year ? end.getMonth() : 11;

		for (let monthI = beginingMonth; monthI <= endMonth; monthI++) {
			months.push(`${MONTHS[monthI]} ${year}`);
		}
	}

	return months;
}

export function createRyanAirURL(from: FlightCtx, to: FlightCtx) {
	const country = "nl";
	const language = "en";
	const url = new URL(`https://www.ryanair.com/${country}/${language}/fare-finder`);

	url.searchParams.append("originIata", from.airport);
	url.searchParams.append("destinationIata", to.airport);
	url.searchParams.append("isReturn", "true");
	url.searchParams.append("isMacDestination", "false");
	url.searchParams.append("promoCode", "");
	url.searchParams.append("adults", "1");
	url.searchParams.append("teens", "0");
	url.searchParams.append("children", "0");
	url.searchParams.append("infants", "0");
	url.searchParams.append("dateOut", formatDate(from.earliest, DateFormatters.Ryanair));
	url.searchParams.append("dateIn", formatDate(to.earliest, DateFormatters.Ryanair));
	url.searchParams.append("daysTrip", "31");
	url.searchParams.append("nightsFrom", "30");
	url.searchParams.append("nightsTo", "31");
	url.searchParams.append("dayOfWeek", "");
	url.searchParams.append("isExactDate", "false");
	url.searchParams.append("outboundFromHour", "00:00");
	url.searchParams.append("outboundToHour", "23:59");
	url.searchParams.append("inboundFromHour", "00:00");
	url.searchParams.append("inboundToHour", "23:59");
	url.searchParams.append("priceValueTo", "");
	url.searchParams.append("currency", "EUR");

	return url.href;
}

export enum Airline {
	Ryanair = "Ryanair",
}

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export type CollectedData = {
	label: string;
	content: {
		date: number;
		price: number;
	}[];
}[];
