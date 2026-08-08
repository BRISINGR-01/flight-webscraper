import { DateFormatters, FlightCtx, formatDate } from "../../data/utils";
import { TripCtx } from "../../ui/src/types";

type RyanAirRoundTripFares = {
  arrivalAirportCategories: null;
  fares: {
    outbound: {
      departureAirport: {
        countryName: string;
        iataCode: string;
        name: string;
        seoName: string;
        city: {
          code: string;
          countryCode: string;
          name: string;
        };
      };
      arrivalAirport: {
        countryName: string;
        iataCode: string;
        name: string;
        seoName: string;
        city: {
          code: string;
          countryCode: string;
          name: string;
        };
      };
      departureDate: string;
      arrivalDate: string;
      price: {
        value: number;
        valueMainUnit: string;
        valueFractionalUnit: string;
        currencyCode: string;
        currencySymbol: string;
      };
      flightKey: string;
      flightNumber: string;
      previousPrice: null;
      priceUpdated: number;
    };
    inbound: {
      departureAirport: {
        countryName: string;
        iataCode: string;
        name: string;
        seoName: string;
        city: {
          code: string;
          countryCode: string;
          name: string;
        };
      };
      arrivalAirport: {
        countryName: string;
        iataCode: string;
        name: string;
        seoName: string;
        city: {
          code: string;
          countryCode: string;
          name: string;
        };
      };
      departureDate: string;
      arrivalDate: string;
      price: {
        value: number;
        valueMainUnit: string;
        valueFractionalUnit: string;
        currencyCode: string;
        currencySymbol: string;
      };
      flightKey: string;
      flightNumber: string;
      previousPrice: null;
      priceUpdated: number;
    };
    summary: {
      price: {
        value: number;
        valueMainUnit: string;
        valueFractionalUnit: string;
        currencyCode: string;
        currencySymbol: string;
      };
      previousPrice: null;
      newRoute: boolean;
      tripDurationDays: number;
    };
  }[];
  nextPage: null;
  size: number;
};

export function fetchRyanAirRoundTripFares(
  trip: TripCtx,
): Promise<RyanAirRoundTripFares> {
  const url = new URL("https://www.ryanair.com/api/farfnd/v4/roundTripFares");

  url.searchParams.append("departureAirportIataCode", trip.depart.airport);
  url.searchParams.append(
    "outboundDepartureDateFrom",
    formatDate(trip.depart.fromDate, DateFormatters.Ryanair),
  );
  url.searchParams.append(
    "outboundDepartureDateTo",
    formatDate(trip.arrive.toDate, DateFormatters.Ryanair),
  );

  url.searchParams.append("market", "en-ie");
  url.searchParams.append("adultPaxCount", "1");
  url.searchParams.append("arrivalAirportIataCode", trip.arrive.airport);
  url.searchParams.append("searchMode", "ALL");

  url.searchParams.append(
    "inboundDepartureDateFrom",
    formatDate(trip.arrive.fromDate, DateFormatters.Ryanair),
  );
  url.searchParams.append(
    "inboundDepartureDateTo",
    formatDate(trip.arrive.toDate, DateFormatters.Ryanair),
  );

  url.searchParams.append("durationFrom", String(1));
  url.searchParams.append("durationTo", String(1));

  url.searchParams.append(
    "outboundDepartureDaysOfWeek",
    "MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY",
  );

  url.searchParams.append("outboundDepartureTimeFrom", "00:00");
  url.searchParams.append("outboundDepartureTimeTo", "23:59");
  url.searchParams.append("inboundDepartureTimeFrom", "00:00");
  url.searchParams.append("inboundDepartureTimeTo", "23:59");

  return ryanairFetch(url);
}

type RyanAirCheapestPerDayResponse = {
  outbound: {
    fares: (
      | {
          day: string;
          arrivalDate: string;
          departureDate: string;
          price: {
            value: number;
            valueMainUnit: string;
            valueFractionalUnit: string;
            currencyCode: string;
            currencySymbol: string;
          };
          soldOut: boolean;
          unavailable: boolean;
        }
      | {
          day: string;
          arrivalDate: null;
          departureDate: null;
          price: null;
          soldOut: boolean;
          unavailable: boolean;
        }
    )[];
    maxFare: {
      day: string;
      arrivalDate: string;
      departureDate: string;
      price: {
        value: number;
        valueMainUnit: string;
        valueFractionalUnit: string;
        currencyCode: string;
        currencySymbol: string;
      };
      soldOut: boolean;
      unavailable: boolean;
    };
    minFare: {
      day: string;
      arrivalDate: string;
      departureDate: string;
      price: {
        value: number;
        valueMainUnit: string;
        valueFractionalUnit: string;
        currencyCode: string;
        currencySymbol: string;
      };
      soldOut: boolean;
      unavailable: boolean;
    };
  };
};

export async function fetchRyanAirCheapestPerDay(
  fromAirport: string,
  toAirport: string,
  date: Date,
): Promise<RyanAirCheapestPerDayResponse> {
  const url = new URL(
    "https://www.ryanair.com/api/farfnd/v4/oneWayFares/" +
      `${fromAirport}/${toAirport}/cheapestPerDay`,
  );

  url.searchParams.append(
    "outboundMonthOfDate",
    formatDate(date, DateFormatters.Ryanair),
  );
  url.searchParams.append("currency", "EUR");
  url.searchParams.append("promoCode", "undefined");

  return ryanairFetch<RyanAirCheapestPerDayResponse>(url);
}

async function ryanairFetch<T>(url: URL): Promise<T> {
  const res = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      client: "desktop",
      "client-version": "0.0.22-alpha.2",
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Brave";v="150"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
    },
    referrer:
      "https://www.ryanair.com/en/en/fare-finder?originIata=EIN&destinationIata=SOF&isReturn=true&isMacDestination=false&promoCode=&adults=1&teens=0&children=0&infants=0&dateOut=2026-12-01&dateIn=2026-12-31&daysTrip=12&nightsFrom=11&nightsTo=31&dayOfWeek=&isExactDate=false&outboundFromHour=00:00&outboundToHour=23:59&inboundFromHour=00:00&inboundToHour=23:59&priceValueTo=&currency=EUR",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  });

  return res.json();
}
