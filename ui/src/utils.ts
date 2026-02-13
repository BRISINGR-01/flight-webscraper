import { PricePoint, Trip } from "./types";

export const API_BASE = "http://localhost:3000";

export class API {
	static async getAirlines() {
		const res = await fetch(`${API_BASE}/airlines`);
		const json = await res.json();
		return json as string[];
	}

	static async getAirports() {
		const res = await fetch(`${API_BASE}/airports`);
		const json = await res.json();
		return json as string[];
	}

	static async getTrips() {
		const res = await fetch(`${API_BASE}/trips`);
		const json = await res.json();
		return json.map((d: any) => new Trip(d));
	}

	static async getTrip(id: string) {
		const res = await fetch(`${API_BASE}/trips/${id}/prices`);
		const json = await res.json();

		return {
			pricesDepart: json.pricesDepart.map((d: any) => new PricePoint(d)),
			pricesReturn: json.pricesReturn.map((d: any) => new PricePoint(d)),
			trip: new Trip(json.trip),
		};
	}

	static async deleteTrip(id: string) {
		await fetch(`${API_BASE}/trips/${id}`, { method: "DELETE" });
	}

	static async createTrip(
		airline: string,
		fromAirport: string,
		toAirport: string,
		fromEarliest: Date,
		fromLatest: Date,
		toEarliest: Date,
		toLatest: Date,
	) {
		return await fetch(`${API_BASE}/trips`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				airline,
				fromAirport,
				toAirport,
				fromEarliest,
				fromLatest,
				toEarliest,
				toLatest,
			}),
		});
	}
}
