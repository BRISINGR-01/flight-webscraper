import {
	createTrip,
	deleteTrip,
	getDistinctAirlines as getAirlines,
	getPriceHistoryForTrip,
	listTrips,
	setUpDb,
} from "./db";

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
	let body: any;
	try {
		body = await req.json();
	} catch {
		return badRequest("Invalid JSON body");
	}

	const { airline, fromAirport, toAirport, fromEarliest, fromLatest, toEarliest, toLatest } = body ?? {};

	if (!airline || !fromAirport || !toAirport) {
		return badRequest("airline, fromAirport and toAirport are required");
	}

	const fromEarliestStr = parseDateOnly(fromEarliest);
	const fromLatestStr = parseDateOnly(fromLatest);
	const toEarliestStr = parseDateOnly(toEarliest);
	const toLatestStr = parseDateOnly(toLatest);

	if (!fromEarliestStr || !fromLatestStr || !toEarliestStr || !toLatestStr) {
		return badRequest("fromEarliest, fromLatest, toEarliest and toLatest must be YYYY-MM-DD");
	}

	const fromEarliestDate = dateFromISO(fromEarliestStr);
	const fromLatestDate = dateFromISO(fromLatestStr);
	const toEarliestDate = dateFromISO(toEarliestStr);
	const toLatestDate = dateFromISO(toLatestStr);

	// Business rule: earliest return at least a day after earliest departure
	const minReturn = new Date(fromEarliestDate);
	minReturn.setDate(fromEarliestDate.getDate() + 1);
	if (toEarliestDate < minReturn) {
		return badRequest("Earliest return must be at least one day after earliest departure");
	}

	// Basic range sanity checks
	if (fromLatestDate < fromEarliestDate) {
		return badRequest("fromLatest must not be before fromEarliest");
	}
	if (toLatestDate < toEarliestDate) {
		return badRequest("toLatest must not be before toEarliest");
	}

	const trip = await createTrip({
		airline,
		fromAirport,
		toAirport,
		fromEarliest: fromEarliestStr,
		fromLatest: fromLatestStr,
		toEarliest: toEarliestStr,
		toLatest: toLatestStr,
	});

	return jsonResponse(trip.id, { status: 201 });
}

async function handleDeleteTrip(id: string | undefined) {
	if (!id) return badRequest("Trip id is required", 404);
	const numericId = Number(id);
	if (!Number.isFinite(numericId)) return badRequest("Invalid trip id");

	await deleteTrip(numericId);
	return new Response(null, { status: 204, headers: corsHeaders });
}

async function handleGetTripPrices(id: string | null) {
	if (!id) return badRequest("Trip id is required", 404);
	const numericId = Number(id);
	if (!Number.isFinite(numericId)) return badRequest("Invalid trip id");

	try {
		const result = await getPriceHistoryForTrip(numericId);
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
			switch (pathname) {
				case "/airlines":
					return jsonResponse(await getAirlines());
				case "/airports":
					break;
				case "/trips":
					switch (req.method) {
						case "GET":
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

			if (pathname.startsWith("/trips/") && pathname.endsWith("/prices") && req.method === "GET") {
				const parts = pathname.split("/");
				// /trips/:id/prices
				const id = parts.length >= 4 ? parts[2] : null;
				return handleGetTripPrices(id ?? null);
			}

			return new Response("Not found", { status: 404, headers: corsHeaders });
		} catch (err) {
			console.error(err);
			return jsonResponse({ error: "Internal server error" }, { status: 500 });
		}
	},
});

console.log(`API server listening on http://localhost:${server.port}`);
