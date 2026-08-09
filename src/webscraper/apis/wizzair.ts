import { firstOfMonth, lastOfMonth } from "../../data/utils";
import { TripCtx } from "../../ui/src/types";

export type WizzaitrAirportsResponse = {
  cities: {
    iata: string;
    mac: string;
    longitude: number;
    currencyCode: string;
    latitude: number;
    shortName: string;
    countryName: string;
    countryCode: string;
    connections: {
      iata: string;
      operationStartDate: string;
      rescueEndDate: string;
      isDomestic: boolean;
      isNew: boolean;
      isConnected: boolean;
      isDirectFlight: boolean;
    }[];
    aliases: string[];
    isExcludedFromGeoLocation: boolean;
    rank: number;
    categories: number[];
    isFakeStation: boolean;
  }[];
  javascript: null;
};

export async function fetchWizzairAirports(): Promise<WizzaitrAirportsResponse> {
  return wizzairFetch(
    new URL(
      "https://be.wizzair.com/29.11.0/Api/asset/map?languageCode=en-gb&withConnections=true",
    ),
  );
}

async function wizzairFetch<T>(
  url: URL,
  method?: string,
  body?: Object,
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      priority: "u=1, i",
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Brave";v="150"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "sec-gpc": "1",
    },
    referrer: "https://www.wizzair.com/",
    body: body ? JSON.stringify(body) : null,
    method: method ?? "GET",
    mode: "cors",
    credentials: "include",
  });

  return res.json();
}

type WizzairFarechartResponse = {
  outboundFlights: {
    departureStation: string;
    arrivalStation: string;
    price: {
      amount: number;
      currencyCode: string;
      exchangedAmount: null;
      exchangedCurrencyCode: null;
    };
    priceType: string;
    date: string;
    classOfService: string;
    hasMacFlight: boolean;
  }[];
  returnFlights: {
    departureStation: string;
    arrivalStation: string;
    price: {
      amount: number;
      currencyCode: string;
      exchangedAmount: null;
      exchangedCurrencyCode: null;
    };
    priceType: string;
    date: string;
    classOfService: string;
    hasMacFlight: boolean;
  }[];
  showPrices: boolean;
};

export async function fetchWizzairFarechart(
  trip: TripCtx,
): Promise<WizzairFarechartResponse> {
  return wizzairFetch(
    new URL("https://be.wizzair.com/29.11.0/Api/asset/farechart"),
    "POST",
    {
      isRescueFare: false,
      adultCount: 1,
      childCount: 0,
      dayInterval: 9,
      wdc: false,
      isFlightChange: false,
      flightList: [
        {
          departureStation: trip.depart.airport,
          arrivalStation: trip.arrive.airport,
          date: firstOfMonth(trip.depart.fromDate),
        },
        {
          departureStation: trip.arrive.airport,
          arrivalStation: trip.depart.airport,
          date: lastOfMonth(trip.depart.toDate),
        },
      ],
    },
  );
}
