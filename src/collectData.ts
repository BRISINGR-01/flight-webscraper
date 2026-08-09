import { Airline } from "./data/utils";
import collectData from "./webscraper/apis/collect";

collectData({
  airline: Airline.Ryanair,
  depart: {
    airport: "TIA",
    fromDate: new Date(2026, 11, 10),
    toDate: new Date(2026, 11, 27),
  },
  arrive: {
    airport: "SOF",
    fromDate: new Date(2027, 0, 1),
    toDate: new Date(2027, 0, 15),
  },
});
