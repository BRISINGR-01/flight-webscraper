import type { ElementHandle } from "puppeteer";
import { save, setUpDb } from "../data/db.ts";
import { logger } from "../data/logger.ts";
import {
  disposePuppeteer,
  extractMonthData,
  getMonthContainers,
  openFlight,
  setUpPuppeteer,
  switchMonth,
} from "./puppeteer.ts";
import {
  Airline,
  createRyanAirURL,
  Ctx,
  DateFormatters,
  FlightCtx,
  formatDate,
  enumerateMonths,
  MONTHS_LABELS,
  type CollectedData,
  firstOfMonth,
  lastOfMonth,
} from "../data/utils.ts";

export async function collectData(
  airline: Airline,
  departureFlight: FlightCtx,
  arrivalFlight: FlightCtx,
) {
  if (arrivalFlight.from.getTime() < departureFlight.from.getTime()) {
    throw new Error("Arrival cannot be earlier than departure");
  }

  arrivalFlight.from = firstOfMonth(arrivalFlight.from);
  arrivalFlight.to = lastOfMonth(arrivalFlight.to);
  departureFlight.from = firstOfMonth(departureFlight.from);
  departureFlight.to = lastOfMonth(departureFlight.to);

  logger.info(
    `Collecting data for ${airline} flights from: ` +
      `${departureFlight.airport}  ${formatDate(departureFlight.from, DateFormatters.Human)} -> ${formatDate(departureFlight.to, DateFormatters.Human)}, ` +
      `to: ${arrivalFlight.airport}  ${formatDate(arrivalFlight.from, DateFormatters.Human)} -> ${formatDate(arrivalFlight.to, DateFormatters.Human)}`,
  );

  await setUpDb();

  const page = await setUpPuppeteer();
  const ctx: Ctx = {
    url: createRyanAirURL(departureFlight, arrivalFlight),
    airline,
    from: departureFlight,
    to: arrivalFlight,
    page,
  };

  await openFlight(ctx);
  logger.info(`Loaded ${ctx.url}`);

  const [departCalendar, returnCalendar] = await getMonthContainers(ctx);

  // the UI opens with both departure and return fligths set to the eariest month:
  // Departure: <from.earliest> | Return: <from.earliest>

  // first collect return flight, bc the ui can be kept consistent (consider scenario where to.earliest is before the month the departure flight that is being scrapped)
  logger.info("Extracting return data");
  await saveData(
    await extractData(ctx, arrivalFlight, returnCalendar),
    ctx,
    arrivalFlight.airport,
    departureFlight.airport,
  );
  logger.info("Saved return data");
  // Departure: <from.earliest> | Return: <to.latest>

  // logger.info("Extracting departure data");
  // await saveData(
  //   await extractData(ctx, departureFlight, departCalendar),
  //   ctx,
  //   departureFlight.airport,
  //   arrivalFlight.airport,
  // );
  // logger.info("Saved departure data");
  // Departure: <from.latest> | Return: <to.latest>

  await disposePuppeteer();
}

export async function extractData(
  ctx: Ctx,
  flight: FlightCtx,
  calendar: ElementHandle<Element>,
) {
  const data: CollectedData = [];

  for (const { month, year } of enumerateMonths(flight.from, flight.to)) {
    const label = `${MONTHS_LABELS[month]} ${year}`;
    try {
      await switchMonth(ctx, calendar, label);
    } catch (err) {
      logger.error(err);
      continue;
    }

    logger.info("Calendar switched to " + label);
    data.push({ month, year, content: await extractMonthData(ctx, calendar) });
    logger.info("Extracted data from " + label);
  }
  return data;
}

export async function saveData(
  data: CollectedData,
  ctx: Ctx,
  fromAirport: string,
  toAirport: string,
) {
  // console.log(data);
  // return;
  for (const { month, year, content } of data) {
    for (const { date, price } of content) {
      await save(
        ctx.airline,
        new Date(year, month, date),
        price,
        fromAirport,
        toAirport,
      );
    }
  }
}

export function createFlight(airport: string, from: Date, to: Date): FlightCtx {
  const now = new Date();
  const nowMS = now.getTime();

  if (to.getTime() < nowMS) throw new Error("Flight dates are in the past");

  if (from.getTime() < nowMS) from = now;
  if (to.getTime() < from.getTime())
    throw new Error("Arrival cannot be earlier than departure");

  return { airport, from, to };
}
