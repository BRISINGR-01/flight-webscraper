import { DataTypes, Model, Op, Sequelize } from "sequelize";
import type { Airline } from "./utils";

const sequelize = new Sequelize("sqlite:artifacts/db.db", {
	logging: (message) => {
		// logger.
	},
});

class DatePrice extends Model {}
DatePrice.init(
	{
		airline: { type: DataTypes.STRING, allowNull: false },
		fromAirport: { type: DataTypes.STRING, allowNull: false },
		toAirport: { type: DataTypes.STRING, allowNull: false },
		takeOff: { type: DataTypes.TIME },
		landing: { type: DataTypes.TIME },
		date: { type: DataTypes.DATEONLY, allowNull: false },
		price: { type: DataTypes.NUMBER, allowNull: false },
	},
	{
		sequelize,
		modelName: "DatePrice",
	},
);

class Trip extends Model {}

Trip.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		airline: { type: DataTypes.STRING, allowNull: false },
		fromAirport: { type: DataTypes.STRING, allowNull: false },
		toAirport: { type: DataTypes.STRING, allowNull: false },
		fromEarliest: { type: DataTypes.DATEONLY, allowNull: false },
		fromLatest: { type: DataTypes.DATEONLY, allowNull: false },
		toEarliest: { type: DataTypes.DATEONLY, allowNull: false },
		toLatest: { type: DataTypes.DATEONLY, allowNull: false },
	},
	{
		sequelize,
		modelName: "Trip",
	},
);

export async function save(
	airline: Airline,
	date: Date,
	price: number,
	fromAirport: string,
	toAirport: string,
	takeOff?: Date,
	landing?: Date,
) {
	return DatePrice.create({
		airline: airline.toString(),
		date,
		price,
		fromAirport,
		toAirport,
	});
}

export async function get() {
	return DatePrice.findAll();
}

export async function setUpDb() {
	await DatePrice.sync();
	await Trip.sync();
}

export async function getDistinctAirlines() {
	const records = await DatePrice.findAll({
		attributes: [[sequelize.fn("DISTINCT", sequelize.col("airline")), "airline"]],
	});
	return records.map((r: any) => r.get("airline") as string);
}

export type TripAttributes = {
	id: number;
	airline: string;
	fromAirport: string;
	toAirport: string;
	fromEarliest: string;
	fromLatest: string;
	toEarliest: string;
	toLatest: string;
};

export async function listTrips(): Promise<TripAttributes[]> {
	const trips = await Trip.findAll({ order: [["id", "ASC"]] });
	return trips.map((t: any) => t.toJSON() as TripAttributes);
}

export async function createTrip(attrs: Omit<TripAttributes, "id">) {
	const created = await Trip.create(attrs as any);
	return created.toJSON() as TripAttributes;
}

export async function deleteTrip(id: number) {
	await Trip.destroy({ where: { id } });
}

export async function getPriceHistoryForTrip(tripId: number) {
	const trip = await Trip.findByPk(tripId);
	if (!trip) {
		throw new Error("Trip not found");
	}

	const t: any = trip;

	// Use full window from earliest outbound to latest return
	const startDate = t.fromEarliest;
	const endDate = t.toLatest;

	const prices = await DatePrice.findAll({
		where: {
			airline: t.airline,
			fromAirport: t.fromAirport,
			toAirport: t.toAirport,
			date: {
				[Op.between]: [startDate, endDate],
			},
		},
		order: [["date", "ASC"]],
	});

	const history = prices.map((p: any) => ({
		date: p.get("date") as string,
		price: p.get("price") as number,
	}));

	const today = new Date().toISOString().slice(0, 10);
	const futureOrToday = history.filter((h) => h.date >= today);
	const cheapestCurrent =
		futureOrToday.length > 0
			? futureOrToday.reduce((min, cur) => (cur.price < min!.price ? cur : min), futureOrToday[0])
			: null;

	return {
		history,
		cheapestCurrent,
	};
}

export { DatePrice, sequelize, Trip };

