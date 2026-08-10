import { DatePrice, DatePriceAttributes, save } from "./data/db";
import { Airline, DateFormatters, formatDate } from "./data/utils";
import { TripCtx } from "./ui/src/types";
import collectData from "./webscraper/apis/collect";
import { fetchWizzairMonthData } from "./webscraper/apis/wizzair";
import Ryanair from "./webscraper/utils/Ryanair";
import Wizzair from "./webscraper/utils/wizzair";

const trip: TripCtx = {
  airline: Airline.Ryanair,
  depart: {
    airport: "EIN",
    fromDate: new Date(2026, 11, 10),
    toDate: new Date(2026, 11, 27),
  },
  arrive: {
    airport: "SOF",
    fromDate: new Date(2027, 0, 1),
    toDate: new Date(2027, 0, 15),
  },
};

new Wizzair().datePrices(trip).then(save);
new Ryanair().datePrices(trip).then(save);
