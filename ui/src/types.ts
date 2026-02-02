export type Trip = {
  id: number;
  airline: string;
  fromAirport: string;
  toAirport: string;
  fromEarliest: string;
  fromLatest: string;
  toEarliest: string;
  toLatest: string;
};

export type PricePoint = {
  date: string;
  price: number;
};

export type PriceHistoryResponse = {
  history: PricePoint[];
  cheapestCurrent: PricePoint | null;
};


