export class Trip {
	id: string;
	airline: string;
	fromAirport: string;
	toAirport: string;
	fromEarliest: Date;
	fromLatest: Date;
	toEarliest: Date;
	toLatest: Date;

	constructor({
		id,
		airline,
		fromAirport,
		toAirport,
		fromEarliest,
		fromLatest,
		toEarliest,
		toLatest,
	}: {
		id: string;
		airline: string;
		fromAirport: string;
		toAirport: string;
		fromEarliest: Date;
		fromLatest: Date;
		toEarliest: Date;
		toLatest: Date;
	}) {
		this.id = id;
		this.airline = airline;
		this.fromAirport = fromAirport;
		this.toAirport = toAirport;
		this.fromEarliest = new Date(fromEarliest);
		this.fromLatest = new Date(fromLatest);
		this.toEarliest = new Date(toEarliest);
		this.toLatest = new Date(toLatest);
	}
}

export class PricePoint {
	date: Date;
	price: number;
	createdAt: Date;

	constructor({ date, price, createdAt }: { createdAt: Date; date: Date; price: number }) {
		this.date = new Date(date);
		this.price = price;
		this.createdAt = new Date(createdAt);
	}
}
