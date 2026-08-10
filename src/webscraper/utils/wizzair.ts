import { DatePriceAttributes } from "../../data/db";
import { Airline, Airport, DateFormatters, formatDate } from "../../data/utils";
import { TripCtx } from "../../ui/src/types";
import {
  fetchWizzairAirports,
  fetchWizzairMonthData,
  WizzaitrAirportResponse,
} from "../apis/wizzair";

export default class Wizzair {
  async datePrices(trip: TripCtx): Promise<DatePriceAttributes[]> {
    const data = await fetchWizzairMonthData(
      trip.depart.airport,
      trip.arrive.airport,
      getMiddle(trip.depart.toDate, trip.depart.fromDate),
      getMiddle(trip.arrive.toDate, trip.arrive.fromDate),
    );

    return [
      ...data.outboundFlights,
      ...data.returnFlights,
    ].map<DatePriceAttributes>((f) => ({
      airline: Airline.Wizzair,
      date: new Date(f.date),
      fromAirport: f.departureStation,
      toAirport: f.arrivalStation,
      price: f.price.amount,
    }));
  }

  async allAirports(): Promise<Airport[]> {
    return (await fetchWizzairAirports()).cities.map((c) => ({
      id: c.iata,
      label: c.shortName,
    }));
  }

  async connections(airport: string): Promise<Airport[]> {
    const airports = (await fetchWizzairAirports()).cities;
    const labels: Record<string, string> = {};
    let data: WizzaitrAirportResponse | undefined;

    for (const a of airports) {
      labels[a.iata] = a.shortName;
      if (a.iata === airport) data = a;
    }

    if (!data)
      throw new Error(`Airport ${airport} has no flights/connection airports`);

    return data.connections
      .map((c) => ({
        id: c.iata,
        label: labels[c.iata] ?? "",
      }))
      .filter((c) => c.label);
  }
}

function getMiddle(a: Date, b: Date) {
  return new Date((a.getTime() - b.getTime()) / 2 + b.getTime());
}
