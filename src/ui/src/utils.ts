import { Airline } from "../../data/utils";
import { PricePoint, TripCtx, TripCtxWithId } from "./types";

export const API_BASE = "http://localhost:3000";

export class APIError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}

async function request(path: string, init?: RequestInit) {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new APIError(
      "Cannot reach the server. Check your connection and try again.",
    );
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (body && typeof body.error === "string" && body.error) ||
      (body && typeof body.message === "string" && body.message) ||
      `Request failed (status ${res.status})`;
    throw new APIError(message, res.status);
  }
  return res;
}

export class API {
  static async getAirlines() {
    const res = await request("/airlines");
    const json = await res.json();
    return json as string[];
  }

  static async getAirports() {
    const res = await request("/airports");
    const json = await res.json();
    return json as string[];
  }

  static async getTrips(): Promise<TripCtxWithId[]> {
    const res = await request("/trips");
    const json = (await res.json()) as TripCtxWithId[];

    for (const el of json) {
      el.arrive.fromDate = new Date(el.arrive.fromDate);
      el.arrive.toDate = new Date(el.arrive.toDate);
      el.depart.fromDate = new Date(el.depart.fromDate);
      el.depart.toDate = new Date(el.depart.toDate);
    }

    return json;
  }

  static async getTrip(id: string) {
    const res = await request(`/trips/${id}/prices`);
    const json = await res.json();
    if (json.error) throw new APIError(json.error);

    return {
      pricesDepart: json.pricesDepart.map(
        (d: any) => new PricePoint(d),
      ) as PricePoint[],
      pricesReturn: json.pricesReturn.map(
        (d: any) => new PricePoint(d),
      ) as PricePoint[],
      trip: {
        id: json.trip.id,
        airline: json.trip.airline as Airline,
        depart: {
          airport: json.trip.depart.airport,
          fromDate: new Date(json.trip.depart.fromDate),
          toDate: new Date(json.trip.depart.toDate),
        },
        arrive: {
          airport: json.trip.arrive.airport,
          fromDate: new Date(json.trip.arrive.fromDate),
          toDate: new Date(json.trip.arrive.toDate),
        },
      },
    };
  }

  static async deleteTrip(id: string) {
    return request(`/trips/${id}`, { method: "DELETE" });
  }

  static async createTrip(trip: TripCtx) {
    const res = await request("/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });

    return res.json();
  }
}
