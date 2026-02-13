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
		fromEarliest: { type: DataTypes.DATE, allowNull: false },
		fromLatest: { type: DataTypes.DATE, allowNull: false },
		toEarliest: { type: DataTypes.DATE, allowNull: false },
		toLatest: { type: DataTypes.DATE, allowNull: false },
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
	fromEarliest: Date;
	fromLatest: Date;
	toEarliest: Date;
	toLatest: Date;
};

export async function listTrips(): Promise<TripAttributes[]> {
	const trips = await Trip.findAll({ order: [["id", "ASC"]] });
	return trips.map((t: any) => t.toJSON() as TripAttributes);
}

export async function createTrip(attrs: Omit<TripAttributes, "id">) {
	const created = await Trip.create(attrs);
	return created.dataValues.id;
}

export async function deleteTrip(id: string) {
	await Trip.destroy({ where: { id } });
}

export async function getPriceHistoryForTrip(tripId: string) {
	const trip = await Trip.findByPk(tripId);
	if (!trip) {
		throw new Error("Trip not found");
	}

	const t: TripAttributes = trip.dataValues;
	const pricesDepart = await DatePrice.findAll({
		where: {
			airline: t.airline,
			fromAirport: t.fromAirport,
			toAirport: t.toAirport,
			date: {
				[Op.between]: [t.fromEarliest, t.fromLatest],
			},
		},
		order: [["createdAt", "ASC"]],
	});
	const pricesReturn = await DatePrice.findAll({
		where: {
			airline: t.airline,
			fromAirport: t.toAirport,
			toAirport: t.fromAirport,
			date: {
				[Op.between]: [t.toEarliest, t.toLatest],
			},
		},
		order: [["createdAt", "ASC"]],
	});

	return {
		pricesDepart: pricesDepart.map((p: DatePrice) => ({
			createdAt: p.dataValues.createdAt,
			date: p.dataValues.date,
			price: p.dataValues.price,
		})),
		pricesReturn: pricesReturn.map((p: DatePrice) => ({
			createdAt: p.dataValues.createdAt,
			date: p.dataValues.date,
			price: p.dataValues.price,
		})),
		trip,
	};
}

export { DatePrice, sequelize, Trip };
