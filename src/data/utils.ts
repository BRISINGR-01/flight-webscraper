import type { Page } from "puppeteer";

export type FlightCtx = {
  airport: string;
  from: Date;
  to: Date;
};

export type Ctx = {
  url: string;
  airline: Airline;
  from: FlightCtx;
  to: FlightCtx;
  page: Page;
};

export enum DateFormatters {
  Ryanair,
  Human,
}

export function formatDate(date: Date, format: DateFormatters) {
  const pad = (n: number) => (n < 10 ? `0${n}` : n.toString());

  switch (format) {
    case DateFormatters.Ryanair:
      return `${pad(date.getFullYear())}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    case DateFormatters.Human:
    default:
      return `${date.getDate()} ${getMonth(date)} ${date.getFullYear()}`;
  }
}

function getMonth(date: Date) {
  return date.toString().split(" ")[1];
}

export function enumerateMonths(start: Date, end: Date) {
  const data = [];
  const startYear = start.getFullYear();

  for (let year = startYear; year <= end.getFullYear(); year++) {
    const beginingMonth = startYear === year ? start.getMonth() : 0;
    const endMonth = end.getFullYear() === year ? end.getMonth() : 11;

    for (let month = beginingMonth; month <= endMonth; month++) {
      data.push({ month, year });
    }
  }

  return data;
}

export function createRyanAirURL(from: FlightCtx, to: FlightCtx) {
  const country = "nl";
  const language = "en";
  const url = new URL(
    `https://www.ryanair.com/${country}/${language}/fare-finder`,
  );

  url.searchParams.append("originIata", from.airport);
  url.searchParams.append("destinationIata", to.airport);
  url.searchParams.append("isReturn", "true");
  url.searchParams.append("isMacDestination", "false");
  url.searchParams.append("promoCode", "");
  url.searchParams.append("adults", "1");
  url.searchParams.append("teens", "0");
  url.searchParams.append("children", "0");
  url.searchParams.append("infants", "0");
  url.searchParams.append(
    "dateOut",
    formatDate(from.from, DateFormatters.Ryanair),
  );
  url.searchParams.append(
    "dateIn",
    formatDate(to.from, DateFormatters.Ryanair),
  );
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

export const MONTHS_LABELS = [
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
  month: number;
  year: number;
  content: {
    date: number;
    price: number;
  }[];
}[];

export const AIRPORTS = [
  { code: "SOF", name: "Sofia" },
  { code: "EIN", name: "Eindhoven" },
];

export function firstOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function lastOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
