import { DataTypes, Model, Op, Sequelize } from "sequelize";
import { firstOfMonth, lastOfMonth, type Airline } from "./utils.ts";
import { TripCtx, TripCtxWithId } from "../ui/src/types.ts";

const sequelize = new Sequelize(
  "sqlite:/home/alex/Desktop/VSC/ryanair/artifacts/db.db",
  {
    logging: (message) => {
      // logger.
    },
  },
);

export type DatePriceAttributes = {
  airline: string;
  fromAirport: string;
  toAirport: string;
  takeOff?: Date;
  landing?: Date;
  date: Date;
  price: number;
};

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

export async function save(data: DatePriceAttributes[]) {
  return DatePrice.bulkCreate(data);
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
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("airline")), "airline"],
    ],
  });
  return records.map((r: any) => r.get("airline") as string);
}

export async function listTrips(): Promise<TripCtxWithId[]> {
  const trips = await Trip.findAll({ order: [["id", "ASC"]] });
  return trips
    .map((t: any) => t.toJSON() as TripAttributes)
    .map((t: TripAttributes) => ({
      id: t.id,
      airline: t.airline as Airline,
      depart: {
        airport: t.fromAirport,
        fromDate: new Date(t.fromEarliest),
        toDate: new Date(t.fromLatest),
      },
      arrive: {
        airport: t.toAirport,
        fromDate: new Date(t.toEarliest),
        toDate: new Date(t.toLatest),
      },
    }));
}

export async function createTrip(trip: TripCtx) {
  const created = await Trip.create({
    airline: trip.airline,
    fromAirport: trip.depart.airport,
    toAirport: trip.arrive.airport,
    fromEarliest: trip.depart.fromDate.toUTCString(),
    fromLatest: trip.depart.toDate.toUTCString(),
    toEarliest: trip.arrive.fromDate.toUTCString(),
    toLatest: trip.arrive.toDate.toUTCString(),
  });
  return created.dataValues.id;
}

export async function deleteTrip(id: string) {
  await Trip.destroy({ where: { id } });
}

export async function getPriceHistoryForTrip(tripId: string) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw new Error("Trip not found");

  const t: TripAttributes = trip.dataValues;
  const pricesDepart = await DatePrice.findAll({
    where: {
      airline: t.airline,
      fromAirport: t.fromAirport,
      toAirport: t.toAirport,
      date: {
        [Op.between]: [
          firstOfMonth(new Date(t.fromEarliest)),
          lastOfMonth(new Date(t.fromLatest)),
        ],
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
        [Op.between]: [
          firstOfMonth(new Date(t.toEarliest)),
          lastOfMonth(new Date(t.toLatest)),
        ],
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
    trip: {
      id: t.id,
      airline: t.airline as Airline,
      depart: {
        airport: t.fromAirport,
        fromDate: new Date(t.fromEarliest),
        toDate: new Date(t.fromLatest),
      },
      arrive: {
        airport: t.toAirport,
        fromDate: new Date(t.toEarliest),
        toDate: new Date(t.toLatest),
      },
    },
  };
}

export { DatePrice, sequelize, Trip };
