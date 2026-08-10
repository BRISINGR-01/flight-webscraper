import { readFileSync } from "fs";
import {
  DateFormatters,
  firstOfMonth,
  formatDate,
  lastOfMonth,
  middleOfMonth,
} from "../../data/utils";
import { TripCtx } from "../../ui/src/types";

export type WizzaitrAirportResponse = {
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
};

export type WizzaitrAirportsResponse = {
  cities: WizzaitrAirportResponse[];
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
      "content-type": "application/json",
      priority: "u=1, i",
      "sec-ch-ua": '"Not;A=Brand";v="8", "Chromium";v="150", "Brave";v="150"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "sec-gpc": "1",
      "x-kpsdk-cd":
        '{"workTime":1786355726078,"id":"b722b978710d2ada5a169bd20a36d307","answers":[27,8],"duration":125.5,"d":-3732,"st":1786355676640,"rst":1786355672908}',
      "x-kpsdk-ct":
        "0Eo7ttRyBT9lmAi518RxvYpRwbKh6DGoa5AWjxDOtmxo8TXtZOxZkxk3OyIQf1NHI0wZdkVbgPySOqMe0UkHXw9D82evEUvTprD6U7MEGH6VngxJwQ16GRNM0yepJA1QbRWhvxvSt8ACsxcy3yrN5q6N4jmipchCMNMr8ZnL",
      "x-kpsdk-h": "01LAYcQHBsrRxyq9ja+CNVxPZlQ9g=",
      "x-kpsdk-v": "j-1.2.616",
      "x-requestverificationtoken": "201a7ec1aae348819fd12ed4d220eedb",
    },
    referrer: "https://www.wizzair.com/",
    body: body ? JSON.stringify(body) : null,
    method: method ?? "GET",
    mode: "cors",
    credentials: "include",
  });

  return res.json();
}

type WizzairMonthDataResponse = {
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

export async function fetchWizzairMonthData(
  fromAirport: string,
  toAirport: string,
  fromDate: Date,
  toDate: Date,
): Promise<WizzairMonthDataResponse> {
  // returns flights for dates: <from date - dayInterval>,date,<to date + dayInterval>
  const res = await wizzairFetch<WizzairMonthDataResponse>(
    new URL("https://be.wizzair.com/29.11.0/Api/asset/farechart"),
    "POST",
    {
      isRescueFare: false,
      adultCount: 1,
      childCount: 0,
      dayInterval: 10, // max 10
      wdc: false,
      isFlightChange: false,
      flightList: [
        {
          departureStation: fromAirport,
          arrivalStation: toAirport,
          date: fromDate,
        },
        {
          departureStation: toAirport,
          arrivalStation: fromAirport,
          date: toDate,
        },
      ],
    },
  );

  res.outboundFlights = res.outboundFlights.filter(
    (f) => f.priceType !== "noData",
  );
  res.returnFlights = res.returnFlights.filter((f) => f.priceType !== "noData");

  return res;
}
