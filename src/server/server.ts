import {
  createTrip,
  deleteTrip,
  getPriceHistoryForTrip,
  listTrips,
  setUpDb,
  Trip,
  TripAttributes,
} from "../data/db";
import { Airline, AIRPORTS } from "../data/utils";
import { TripCtx } from "../ui/src/types";
import { collectData } from "../webscraper";

const port = Number(process.env.PORT ?? 3000);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

function badRequest(message: string, status = 400) {
  return jsonResponse({ error: message }, { status });
}

function parseDateOnly(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // Expect a simple YYYY-MM-DD string
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return value;
}

function dateFromISO(dateOnly: string): Date {
  // Normalise as UTC midnight to avoid TZ surprises
  return new Date(`${dateOnly}T00:00:00Z`);
}

async function handleCreateTrip(req: Request) {
  let body: TripCtx;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  body.arrive.fromDate = new Date(body.arrive.fromDate);
  body.arrive.toDate = new Date(body.arrive.toDate);
  body.depart.fromDate = new Date(body.depart.fromDate);
  body.depart.toDate = new Date(body.depart.toDate);

  // Business rule: earliest return at least a day after earliest departure
  const minReturn = new Date(body.depart.fromDate);
  minReturn.setDate(minReturn.getDate() + 1);
  if (body.arrive.fromDate < minReturn) {
    return badRequest(
      "Earliest return must be at least one day after earliest departure",
    );
  }

  // Basic range sanity checks
  if (body.arrive.toDate < body.arrive.fromDate) {
    return badRequest("fromLatest must not be before fromEarliest");
  }
  if (body.depart.toDate < body.depart.fromDate) {
    return badRequest("toLatest must not be before toEarliest");
  }

  const trip = await createTrip(body);

  return jsonResponse(trip.id, { status: 201 });
}

async function handleDeleteTrip(id: string | undefined) {
  if (!id) return badRequest("Trip id is required", 404);

  await deleteTrip(id);
  return new Response(null, { status: 204, headers: corsHeaders });
}

async function handleGetTripPrices(id: string | null) {
  if (!id) return badRequest("Trip id is required", 404);

  try {
    let result = await getPriceHistoryForTrip(id);
    if (result.pricesDepart.length === 0) {
      const trip = await Trip.findByPk(id);
      if (!trip) throw new Error("Trip not found");

      const t: TripAttributes = trip.dataValues;

      await collectData(
        t.airline as Airline,
        {
          airport: t.fromAirport,
          from: new Date(t.fromEarliest),
          to: new Date(t.fromLatest),
        },
        {
          airport: t.toAirport,
          from: new Date(t.toEarliest),
          to: new Date(t.toLatest),
        },
      );

      result = await getPriceHistoryForTrip(id);
    }
    return jsonResponse(result);
  } catch (err) {
    return badRequest((err as Error).message, 404);
  }
}

await setUpDb();

// Bun HTTP server
// Run with: bun run server.ts
const server = Bun.serve({
  port,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const { pathname } = url;

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      switch (pathname.split("/")[1]) {
        case "airlines":
          // return jsonResponse(await getAirlines());
          return jsonResponse(["Ryanair"]);
        case "airports":
          return jsonResponse(AIRPORTS.map(({ name }) => name));
        case "trips":
          switch (req.method) {
            case "GET":
              if (pathname.endsWith("/prices")) {
                const parts = pathname.split("/");
                // /trips/:id/prices
                const id = parts.length >= 4 ? parts[2] : null;
                return handleGetTripPrices(id ?? null);
              }

              return jsonResponse(await listTrips());
            case "POST":
              return handleCreateTrip(req);
            case "DELETE":
              return handleDeleteTrip(pathname.split("/")[2]);

            default:
              break;
          }
          break;
        default:
          break;
      }

      return new Response("Not found", { status: 404, headers: corsHeaders });
    } catch (err) {
      console.error(err);
      return jsonResponse({ error: "Internal server error" }, { status: 500 });
    }
  },
});

console.log(`API server listening on http://localhost:${server.port}`);
