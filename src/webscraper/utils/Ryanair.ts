import { DatePriceAttributes } from "../../data/db";
import { Airport, enumerateMonths } from "../../data/utils";
import { TripCtx } from "../../ui/src/types";
import {
  fetchRyanairAirports,
  fetchRyanAirCheapestPerDay,
  fetchRyanairPossibleArrivalAirports,
} from "../apis/ryanair";

export default class Ryanair {
  async datePrices(trip: TripCtx): Promise<DatePriceAttributes[]> {
    const data: DatePriceAttributes[] = [];

    const collectFor = async (
      fromAirport: string,
      toAirport: string,
      fromDate: Date,
      toDate: Date,
    ) => {
      for (const { month, year } of enumerateMonths(fromDate, toDate)) {
        const res = await fetchRyanAirCheapestPerDay(
          fromAirport,
          toAirport,
          new Date(year, month),
        );

        data.push(
          ...res.outbound.fares.map<DatePriceAttributes>((fare) => ({
            airline: trip.airline,
            price: fare.price!.value,
            date: new Date(fare.day),
            fromAirport: trip.depart.airport,
            toAirport: trip.arrive.airport,
            landing: fare.arrivalDate ? new Date(fare.arrivalDate) : undefined,
            takeOff: fare.departureDate
              ? new Date(fare.departureDate)
              : undefined,
          })),
        );
      }
    };

    await Promise.allSettled([
      collectFor(
        trip.depart.airport,
        trip.arrive.airport,
        trip.depart.fromDate,
        trip.depart.toDate,
      ),
      collectFor(
        trip.arrive.airport,
        trip.depart.airport,
        trip.arrive.fromDate,
        trip.arrive.toDate,
      ),
    ]);

    return data;
  }

  async allAirports(): Promise<Airport[]> {
    return (await fetchRyanairAirports()).map((a) => ({
      id: a.city.code,
      label: a.city.name,
    }));
  }

  async connections(airport: string): Promise<Airport[]> {
    return (await fetchRyanairPossibleArrivalAirports(airport)).map((a) => ({
      id: a.arrivalAirport.city.code,
      label: a.arrivalAirport.city.name,
    }));
  }
}
