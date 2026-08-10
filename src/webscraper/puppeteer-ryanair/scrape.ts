import { collectData, createFlight } from ".";
import { Airline } from "../../data/utils";

collectData(
  Airline.Ryanair,
  createFlight("EIN", new Date(2026, 11, 10), new Date(2026, 11, 27)),
  createFlight("SOF", new Date(2027, 0, 1), new Date(2027, 0, 15)),
);
