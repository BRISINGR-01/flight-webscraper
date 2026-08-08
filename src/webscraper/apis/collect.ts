import { DatePriceAttributes, save } from "../../data/db";
import { Airline, enumerateMonths } from "../../data/utils";
import { TripCtx } from "../../ui/src/types";
import { fetchRyanAirCheapestPerDay } from "./ryanair";

export default async function collectData(trip: TripCtx) {
  if (trip.airline !== Airline.Ryanair) throw new Error("Only Ryanair");

  for (const { month, year } of enumerateMonths(
    trip.depart.fromDate,
    trip.depart.toDate,
  )) {
    const data = await fetchRyanAirCheapestPerDay(
      trip.depart.airport,
      trip.arrive.airport,
      new Date(year, month),
    );

    await save(
      data.outbound.fares
        .filter((d) => !d.soldOut && d.price)
        .map<DatePriceAttributes>((d) => ({
          airline: trip.airline,
          price: d.price!.value,
          date: new Date(d.day),
          fromAirport: trip.depart.airport,
          toAirport: trip.arrive.airport,
          landing: d.arrivalDate ? new Date(d.arrivalDate) : undefined,
          takeOff: d.departureDate ? new Date(d.departureDate) : undefined,
        })),
    );
  }

  for (const { month, year } of enumerateMonths(
    trip.arrive.fromDate,
    trip.arrive.toDate,
  )) {
    const data = await fetchRyanAirCheapestPerDay(
      trip.arrive.airport,
      trip.depart.airport,
      new Date(year, month),
    );

    await save(
      data.outbound.fares
        .filter((d) => !d.soldOut && d.price)
        .map<DatePriceAttributes>((d) => ({
          airline: trip.airline,
          price: d.price!.value,
          date: new Date(d.day),
          fromAirport: trip.arrive.airport,
          toAirport: trip.depart.airport,
          landing: d.arrivalDate ? new Date(d.arrivalDate) : undefined,
          takeOff: d.departureDate ? new Date(d.departureDate) : undefined,
        })),
    );
  }

  console.log("Success");
}
