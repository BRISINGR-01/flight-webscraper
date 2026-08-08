import { Airline } from "../../data/utils";

export type TripCtx = {
  airline: Airline;
  depart: { airport: string; fromDate: Date; toDate: Date };
  arrive: { airport: string; fromDate: Date; toDate: Date };
};

export type TripCtxWithId = TripCtx & { id: number };

export class PricePoint {
  date: Date;
  price: number;
  createdAt: Date;

  constructor({
    date,
    price,
    createdAt,
  }: {
    createdAt: Date;
    date: Date;
    price: number;
  }) {
    this.date = new Date(date);
    this.price = price;
    this.createdAt = new Date(createdAt);
  }
}
