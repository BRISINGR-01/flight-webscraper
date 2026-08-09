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

  const res = await ryanairFetch<RyanAirCheapestPerDayResponse>(url);

  res.outbound.fares = res.outbound.fares.filter((f) => f.arrivalDate);

  return res;
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
    referrer: "https://www.ryanair.com/em/en",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  });

  return res.json();
}

type RyaiainrAirportsResponse = {
  code: string;
  name: string;
  seoName: string;
  aliases: never[];
  base: boolean;
  city: {
    name: string;
    code: string;
  };
  region: {
    name: string;
    code: string;
  };
  country: {
    code: string;
    iso3code: string;
    name: string;
    currency: string;
    defaultAirportCode: string;
    schengen: boolean;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timeZone: string;
}[];

export async function fetchRyanairAirports(): Promise<RyaiainrAirportsResponse> {
  return ryanairFetch(
    new URL("https://www.ryanair.com/api/views/locate/5/airports/en/active"),
  );
}

type RyanairPossibleArrivalAirportsResponse = {
  arrivalAirport: {
    code: string;
    name: string;
    seoName: string;
    aliases: never[];
    base: boolean;
    city: {
      name: string;
      code: string;
      macCode?: undefined;
    };
    region: {
      name: string;
      code: string;
    };
    country: {
      code: string;
      iso3code: string;
      name: string;
      currency: string;
      defaultAirportCode: string;
      schengen: boolean;
    };
    coordinates: {
      latitude: number;
      longitude: number;
    };
    timeZone: string;
    macCity?: undefined;
  };
  recent: boolean;
  seasonal: boolean;
  operator: string;
  tags: never[];
}[];

export async function fetchRyanairPossibleArrivalAirports(
  outboundAirport: string,
): Promise<RyanairPossibleArrivalAirportsResponse> {
  return ryanairFetch(
    new URL(
      "https://www.ryanair.com/api/views/locate/searchWidget/routes/en/airport/" +
        outboundAirport,
    ),
  );
}

const s = [
  {
    arrivalAirport: {
      code: "AHO",
      name: "Alghero",
      seoName: "alghero",
      aliases: [],
      base: true,
      city: { name: "Alghero", code: "ALGHERO" },
      region: { name: "Sardinia", code: "SARDINIA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 40.6321, longitude: 8.29077 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "ARN",
      name: "Stockholm Arlanda",
      seoName: "stockholm-arlandia",
      aliases: [],
      base: true,
      city: { name: "Stockholm", code: "STOCKHOLM", macCode: "SLM" },
      macCity: { name: "Stockholm", code: "STOCKHOLM", macCode: "SLM" },
      region: { name: "Stockholm", code: "STOCKHOLM" },
      country: {
        code: "se",
        iso3code: "SWE",
        name: "Sweden",
        currency: "SEK",
        defaultAirportCode: "NYO",
        schengen: true,
      },
      coordinates: { latitude: 59.6498, longitude: 17.9239 },
      timeZone: "Europe/Stockholm",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "BGY",
      name: "Milan Bergamo",
      seoName: "milan-bergamo",
      aliases: [],
      base: true,
      city: { name: "Bergamo", code: "BERGAMO" },
      macCity: { name: "Milan", code: "MILAN", macCode: "MIL" },
      region: { name: "Lombardy", code: "LOMBARDY" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 45.6739, longitude: 9.70417 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "BHX",
      name: "Birmingham",
      seoName: "birmingham",
      aliases: [],
      base: true,
      city: { name: "Birmingham", code: "BIRMINGHAM" },
      region: { name: "England", code: "ENGLAND" },
      country: {
        code: "gb",
        iso3code: "GBR",
        name: "United Kingdom",
        currency: "GBP",
        defaultAirportCode: "STN",
        schengen: false,
      },
      coordinates: { latitude: 52.4539, longitude: -1.74803 },
      timeZone: "Europe/London",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "BLQ",
      name: "Bologna",
      seoName: "bologna",
      aliases: [],
      base: true,
      city: { name: "Bologna", code: "BOLOGNA" },
      region: { name: "Emilia-Romagna", code: "EMILIA-ROMAGNA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 44.5354, longitude: 11.2887 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "BRI",
      name: "Bari",
      seoName: "bari",
      aliases: [],
      base: true,
      city: { name: "Bari", code: "BARI" },
      region: { name: "Puglia", code: "PUGLIA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 41.1389, longitude: 16.7606 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "BTS",
      name: "Bratislava",
      seoName: "bratislava",
      aliases: [],
      base: true,
      city: { name: "Bratislava", code: "BRATISLAVA" },
      region: { name: "Bratislava", code: "BRATISLAVA" },
      country: {
        code: "sk",
        iso3code: "SVK",
        name: "Slovakia",
        currency: "EUR",
        defaultAirportCode: "BTS",
        schengen: true,
      },
      coordinates: { latitude: 48.1702, longitude: 17.2127 },
      timeZone: "Europe/Bratislava",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "BUD",
      name: "Budapest",
      seoName: "budapest",
      aliases: [],
      base: true,
      city: { name: "Budapest", code: "BUDAPEST" },
      region: { name: "Central Hungary", code: "CENTRAL_HUNGARY" },
      country: {
        code: "hu",
        iso3code: "HUN",
        name: "Hungary",
        currency: "HUF",
        defaultAirportCode: "BUD",
        schengen: true,
      },
      coordinates: { latitude: 47.4369, longitude: 19.2556 },
      timeZone: "Europe/Budapest",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "BVA",
      name: "Paris Beauvais",
      seoName: "paris-beauvais",
      aliases: [],
      base: false,
      city: { name: "Paris", code: "PARIS", macCode: "PAR" },
      macCity: { name: "Paris", code: "PARIS", macCode: "PAR" },
      region: { name: "Picardy", code: "PICARDY" },
      country: {
        code: "fr",
        iso3code: "FRA",
        name: "France",
        currency: "EUR",
        defaultAirportCode: "BVA",
        schengen: true,
      },
      coordinates: { latitude: 49.4544, longitude: 2.11278 },
      timeZone: "Europe/Paris",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "CGN",
      name: "Cologne",
      seoName: "cologne-bonn",
      aliases: [],
      base: true,
      city: { name: "Cologne", code: "COLOGNE" },
      region: {
        name: "North Rhine-Westphalia",
        code: "NORTH_RHINE-WESTPHALIA",
      },
      country: {
        code: "de",
        iso3code: "DEU",
        name: "Germany",
        currency: "EUR",
        defaultAirportCode: "HHN",
        schengen: true,
      },
      coordinates: { latitude: 50.8659, longitude: 7.14274 },
      timeZone: "Europe/Berlin",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "CIA",
      name: "Rome Ciampino",
      seoName: "rome-ciampino",
      aliases: [],
      base: true,
      city: { name: "Rome", code: "ROME", macCode: "ROM" },
      macCity: { name: "Rome", code: "ROME", macCode: "ROM" },
      region: { name: "Lazio", code: "LAZIO" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 41.7994, longitude: 12.5949 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "CRL",
      name: "Brussels Charleroi",
      seoName: "brussels-charleroi",
      aliases: [],
      base: true,
      city: { name: "Charleroi", code: "CHARLEROI" },
      macCity: { name: "Brussels", code: "BRUSSELS", macCode: "BRL" },
      region: { name: "Wallonia", code: "WALLONIA" },
      country: {
        code: "be",
        iso3code: "BEL",
        name: "Belgium",
        currency: "EUR",
        defaultAirportCode: "BRU",
        schengen: true,
      },
      coordinates: { latitude: 50.4592, longitude: 4.45382 },
      timeZone: "Europe/Brussels",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "CTA",
      name: "Catania",
      seoName: "catania",
      aliases: [],
      base: true,
      city: { name: "Catania", code: "CATANIA" },
      region: { name: "Sicily", code: "SICILY" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 37.4668, longitude: 15.0664 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "DUB",
      name: "Dublin",
      seoName: "dublin",
      aliases: [],
      base: true,
      city: { name: "Dublin", code: "DUBLIN" },
      region: { name: "Leinster", code: "LEINSTER" },
      country: {
        code: "ie",
        iso3code: "IRL",
        name: "Ireland",
        currency: "EUR",
        defaultAirportCode: "DUB",
        schengen: false,
      },
      coordinates: { latitude: 53.4213, longitude: -6.27007 },
      timeZone: "Europe/Dublin",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "EDI",
      name: "Edinburgh",
      seoName: "edinburgh",
      aliases: [],
      base: true,
      city: { name: "Edinburgh", code: "EDINBURGH" },
      region: { name: "Scotland", code: "SCOTLAND" },
      country: {
        code: "gb",
        iso3code: "GBR",
        name: "United Kingdom",
        currency: "GBP",
        defaultAirportCode: "STN",
        schengen: false,
      },
      coordinates: { latitude: 55.95, longitude: -3.3725 },
      timeZone: "Europe/London",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "EIN",
      name: "Eindhoven",
      seoName: "eindhoven",
      aliases: [],
      base: true,
      city: { name: "Eindhoven", code: "EINDHOVEN" },
      region: { name: "North Brabant", code: "NORTH_BRABANT" },
      country: {
        code: "nl",
        iso3code: "NLD",
        name: "Netherlands",
        currency: "EUR",
        defaultAirportCode: "EIN",
        schengen: true,
      },
      coordinates: { latitude: 51.4501, longitude: 5.37453 },
      timeZone: "Europe/Amsterdam",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "FKB",
      name: "Karlsruhe / Baden-Baden",
      seoName: "karlsruhe-baden",
      aliases: [],
      base: true,
      city: { name: "Karlsruhe", code: "KARLSRUHE" },
      region: { name: "Baden-Württemberg", code: "BADEN-WURTTEMBERG" },
      country: {
        code: "de",
        iso3code: "DEU",
        name: "Germany",
        currency: "EUR",
        defaultAirportCode: "HHN",
        schengen: true,
      },
      coordinates: { latitude: 48.7794, longitude: 8.0805 },
      timeZone: "Europe/Berlin",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "FMM",
      name: "Memmingen",
      seoName: "munich-memmingen",
      aliases: [],
      base: true,
      city: { name: "Memmingen", code: "MEMMINGEN" },
      region: { name: "Swabia", code: "SWABIA" },
      country: {
        code: "de",
        iso3code: "DEU",
        name: "Germany",
        currency: "EUR",
        defaultAirportCode: "HHN",
        schengen: true,
      },
      coordinates: { latitude: 47.9888, longitude: 10.2395 },
      timeZone: "Europe/Berlin",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "GDN",
      name: "Gdansk",
      seoName: "gdansk",
      aliases: [],
      base: true,
      city: { name: "Gdansk", code: "GDANSK" },
      region: { name: "Pomerania", code: "POMERANIA" },
      country: {
        code: "pl",
        iso3code: "POL",
        name: "Poland",
        currency: "PLN",
        defaultAirportCode: "WMI",
        schengen: true,
      },
      coordinates: { latitude: 54.3776, longitude: 18.4662 },
      timeZone: "Europe/Warsaw",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "GOA",
      name: "Genoa",
      seoName: "genoa",
      aliases: [],
      base: false,
      city: { name: "Genoa", code: "GENOA" },
      region: { name: "Liguria", code: "LIGURIA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 44.4133, longitude: 8.8375 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "KRK",
      name: "Krakow",
      seoName: "krakow",
      aliases: [],
      base: true,
      city: { name: "Krakow", code: "KRAKOW" },
      region: { name: "Malopolska", code: "MALOPOLSKA" },
      country: {
        code: "pl",
        iso3code: "POL",
        name: "Poland",
        currency: "PLN",
        defaultAirportCode: "WMI",
        schengen: true,
      },
      coordinates: { latitude: 50.0777, longitude: 19.7848 },
      timeZone: "Europe/Warsaw",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "KTW",
      name: "Katowice",
      seoName: "katowice",
      aliases: [],
      base: true,
      city: { name: "Katowice", code: "KATOWICE" },
      region: { name: "Upper Silesia", code: "UPPER_SILESIA" },
      country: {
        code: "pl",
        iso3code: "POL",
        name: "Poland",
        currency: "PLN",
        defaultAirportCode: "WMI",
        schengen: true,
      },
      coordinates: { latitude: 50.4743, longitude: 19.08 },
      timeZone: "Europe/Warsaw",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "LPL",
      name: "Liverpool",
      seoName: "liverpool",
      aliases: [],
      base: true,
      city: { name: "Liverpool", code: "LIVERPOOL" },
      region: { name: "England", code: "ENGLAND" },
      country: {
        code: "gb",
        iso3code: "GBR",
        name: "United Kingdom",
        currency: "GBP",
        defaultAirportCode: "STN",
        schengen: false,
      },
      coordinates: { latitude: 53.3336, longitude: -2.84972 },
      timeZone: "Europe/London",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "MAD",
      name: "Madrid",
      seoName: "madrid",
      aliases: [],
      base: true,
      city: { name: "Madrid", code: "MADRID" },
      region: { name: "Madrid", code: "MADRID" },
      country: {
        code: "es",
        iso3code: "ESP",
        name: "Spain",
        currency: "EUR",
        defaultAirportCode: "BCN",
        schengen: true,
      },
      coordinates: { latitude: 40.4722, longitude: -3.5608 },
      timeZone: "Europe/Madrid",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "MAN",
      name: "Manchester",
      seoName: "manchester",
      aliases: [],
      base: true,
      city: { name: "Manchester", code: "MANCHESTER" },
      region: { name: "Greater Manchester", code: "GREATER_MANCHESTER" },
      country: {
        code: "gb",
        iso3code: "GBR",
        name: "United Kingdom",
        currency: "GBP",
        defaultAirportCode: "STN",
        schengen: false,
      },
      coordinates: { latitude: 53.3537, longitude: -2.27495 },
      timeZone: "Europe/London",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "MLA",
      name: "Malta",
      seoName: "malta",
      aliases: [],
      base: true,
      city: { name: "Malta", code: "MALTA" },
      region: { name: "Malta", code: "MALTA" },
      country: {
        code: "mt",
        iso3code: "MLT",
        name: "Malta",
        currency: "EUR",
        defaultAirportCode: "MLA",
        schengen: true,
      },
      coordinates: { latitude: 35.8575, longitude: 14.4775 },
      timeZone: "Europe/Malta",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "MRS",
      name: "Marseille",
      seoName: "marseille",
      aliases: [],
      base: true,
      city: { name: "Marseille", code: "MARSEILLE" },
      region: {
        name: "French Riviera",
        code: "PROVENCE-ALPES-COTE_DAZUR_FRENCH_RIVIERA",
      },
      country: {
        code: "fr",
        iso3code: "FRA",
        name: "France",
        currency: "EUR",
        defaultAirportCode: "BVA",
        schengen: true,
      },
      coordinates: { latitude: 43.4393, longitude: 5.22142 },
      timeZone: "Europe/Paris",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "MXP",
      name: "Milan Malpensa",
      seoName: "milan-malpensa",
      aliases: [],
      base: true,
      city: { name: "Milan", code: "MILAN", macCode: "MIL" },
      macCity: { name: "Milan", code: "MILAN", macCode: "MIL" },
      region: { name: "Lombardy", code: "LOMBARDY" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 45.63, longitude: 8.7231 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "NAP",
      name: "Naples",
      seoName: "naples",
      aliases: [],
      base: true,
      city: { name: "Naples", code: "NAPLES" },
      region: { name: "Campania", code: "CAMPANIA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 40.8844, longitude: 14.2908 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "NRN",
      name: "Dusseldorf Weeze",
      seoName: "dusseldorf",
      aliases: [],
      base: true,
      city: { name: "Dusseldorf", code: "DUSSELDORF", macCode: "DOF" },
      macCity: { name: "Dusseldorf", code: "DUSSELDORF", macCode: "DOF" },
      region: {
        name: "North Rhine-Westphalia",
        code: "NORTH_RHINE-WESTPHALIA",
      },
      country: {
        code: "de",
        iso3code: "DEU",
        name: "Germany",
        currency: "EUR",
        defaultAirportCode: "HHN",
        schengen: true,
      },
      coordinates: { latitude: 51.6024, longitude: 6.14217 },
      timeZone: "Europe/Berlin",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "OTP",
      name: "Bucharest Otopeni",
      seoName: "Bucharest-Otopeni",
      aliases: [],
      base: true,
      city: { name: "Bucharest", code: "BUCHAREST", macCode: "BUC" },
      macCity: { name: "Bucharest", code: "BUCHAREST", macCode: "BUC" },
      region: { name: "Bucharest", code: "BUCHAREST" },
      country: {
        code: "ro",
        iso3code: "ROU",
        name: "Romania",
        currency: "EUR",
        defaultAirportCode: "OTP",
        schengen: false,
      },
      coordinates: { latitude: 44.5722, longitude: 26.1022 },
      timeZone: "Europe/Bucharest",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "PMF",
      name: "Parma",
      seoName: "parma",
      aliases: [],
      base: false,
      city: { name: "Parma", code: "PARMA" },
      region: { name: "Emilia-Romagna", code: "EMILIA-ROMAGNA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 44.8245, longitude: 10.2964 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "PMO",
      name: "Palermo",
      seoName: "palermo",
      aliases: [],
      base: true,
      city: { name: "Palermo", code: "PALERMO" },
      region: { name: "Sicily", code: "SICILY" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 38.176, longitude: 13.091 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "POZ",
      name: "Poznan",
      seoName: "poznan",
      aliases: [],
      base: true,
      city: { name: "Poznan", code: "POZNAN" },
      region: { name: "Wielkopolska", code: "WIELKOPOLSKA" },
      country: {
        code: "pl",
        iso3code: "POL",
        name: "Poland",
        currency: "PLN",
        defaultAirportCode: "WMI",
        schengen: true,
      },
      coordinates: { latitude: 52.421, longitude: 16.8263 },
      timeZone: "Europe/Warsaw",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "PRG",
      name: "Prague",
      seoName: "prague",
      aliases: [],
      base: true,
      city: { name: "Prague", code: "PRAGUE" },
      region: { name: "Central Bohemian", code: "CENTRAL_BOHEMIAN" },
      country: {
        code: "cz",
        iso3code: "CZE",
        name: "Czech Republic",
        currency: "CZK",
        defaultAirportCode: "PRG",
        schengen: true,
      },
      coordinates: { latitude: 50.1008, longitude: 14.26 },
      timeZone: "Europe/Prague",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "PSA",
      name: "Pisa",
      seoName: "pisa",
      aliases: [],
      base: true,
      city: { name: "Pisa", code: "PISA" },
      region: { name: "Tuscany", code: "TUSCANY" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 43.6839, longitude: 10.3927 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "PSR",
      name: "Pescara",
      seoName: "pescara",
      aliases: [],
      base: true,
      city: { name: "Pescara", code: "PESCARA" },
      region: { name: "Abruzzo", code: "ABRUZZO" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 42.4317, longitude: 14.1811 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "RMI",
      name: "Rimini",
      seoName: "rimini",
      aliases: [],
      base: false,
      city: { name: "Rimini", code: "RIMINI" },
      region: { name: "Default IT", code: "DEFAULT_IT" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 44.0203, longitude: 12.6117 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "STN",
      name: "London Stansted",
      seoName: "london-stansted",
      aliases: [],
      base: true,
      city: { name: "London", code: "LONDON", macCode: "LON" },
      macCity: { name: "London", code: "LONDON", macCode: "LON" },
      region: { name: "England", code: "ENGLAND" },
      country: {
        code: "gb",
        iso3code: "GBR",
        name: "United Kingdom",
        currency: "GBP",
        defaultAirportCode: "STN",
        schengen: false,
      },
      coordinates: { latitude: 51.885, longitude: 0.235 },
      timeZone: "Europe/London",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "SUF",
      name: "Lamezia",
      seoName: "lamezia",
      aliases: [],
      base: true,
      city: { name: "Lamezia", code: "LAMEZIA" },
      region: { name: "Calabria", code: "CALABRIA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 38.9054, longitude: 16.2423 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "TRN",
      name: "Turin",
      seoName: "turin",
      aliases: [],
      base: true,
      city: { name: "Turin", code: "TURIN" },
      region: { name: "Piedmont", code: "PIEDMONT" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 45.2008, longitude: 7.64963 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "TRS",
      name: "Trieste",
      seoName: "trieste",
      aliases: [],
      base: false,
      city: { name: "Trieste", code: "TRIESTE" },
      region: { name: "Friuli-Venezia Giulia", code: "FRIULI-VENEZIA_GIULIA" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 45.8275, longitude: 13.4722 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "TSF",
      name: "Venice Treviso",
      seoName: "venice-treviso",
      aliases: [],
      base: false,
      city: { name: "Venice", code: "VENICE", macCode: "VEN" },
      macCity: { name: "Venice", code: "VENICE", macCode: "VEN" },
      region: { name: "Veneto", code: "VENETO" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 45.6484, longitude: 12.1944 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "VIE",
      name: "Vienna",
      seoName: "vienna",
      aliases: [],
      base: true,
      city: { name: "Vienna", code: "VIENNA" },
      region: { name: "Vienna", code: "VIENNA" },
      country: {
        code: "at",
        iso3code: "AUT",
        name: "Austria",
        currency: "EUR",
        defaultAirportCode: "VIE",
        schengen: true,
      },
      coordinates: { latitude: 48.123, longitude: 16.2221 },
      timeZone: "Europe/Vienna",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "VRN",
      name: "Verona",
      seoName: "verona",
      aliases: [],
      base: false,
      city: { name: "Verona", code: "VERONA" },
      region: { name: "Veneto", code: "VENETO" },
      country: {
        code: "it",
        iso3code: "ITA",
        name: "Italy",
        currency: "EUR",
        defaultAirportCode: "BGY",
        schengen: true,
      },
      coordinates: { latitude: 45.3957, longitude: 10.8885 },
      timeZone: "Europe/Rome",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "WAW",
      name: "Warsaw Chopin",
      seoName: "warsaw-chopin",
      aliases: [],
      base: true,
      city: { name: "Warsaw", code: "WARSAW", macCode: "WWA" },
      macCity: { name: "Warsaw", code: "WARSAW", macCode: "WWA" },
      region: { name: "Voivodship", code: "VOIVODSHIP" },
      country: {
        code: "pl",
        iso3code: "POL",
        name: "Poland",
        currency: "PLN",
        defaultAirportCode: "WMI",
        schengen: true,
      },
      coordinates: { latitude: 52.1657, longitude: 20.9671 },
      timeZone: "Europe/Warsaw",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "WMI",
      name: "Warsaw Modlin",
      seoName: "warsaw-modlin",
      aliases: [],
      base: true,
      city: { name: "Warsaw", code: "WARSAW", macCode: "WWA" },
      macCity: { name: "Warsaw", code: "WARSAW", macCode: "WWA" },
      region: { name: "Voivodship", code: "VOIVODSHIP" },
      country: {
        code: "pl",
        iso3code: "POL",
        name: "Poland",
        currency: "PLN",
        defaultAirportCode: "WMI",
        schengen: true,
      },
      coordinates: { latitude: 52.4511, longitude: 20.6517 },
      timeZone: "Europe/Warsaw",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
  {
    arrivalAirport: {
      code: "WRO",
      name: "Wroclaw",
      seoName: "wroclaw",
      aliases: [],
      base: true,
      city: { name: "Wroclaw", code: "WROCLAW" },
      region: {
        name: "Lower Silesian Voivodeship",
        code: "LOWER_SILESIAN_VOIVODESHIP",
      },
      country: {
        code: "pl",
        iso3code: "POL",
        name: "Poland",
        currency: "PLN",
        defaultAirportCode: "WMI",
        schengen: true,
      },
      coordinates: { latitude: 51.1027, longitude: 16.8858 },
      timeZone: "Europe/Warsaw",
    },
    recent: true,
    seasonal: false,
    operator: "FR",
    tags: [],
  },
];
