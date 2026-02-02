import type { ElementHandle } from "puppeteer";
import { save, setUpDb } from "./db.ts";
import { logger } from "./logger.ts";
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
	getMonthLables,
	MONTHS,
	type CollectedData,
} from "./utils.ts";

async function collectData(airline: Airline, from: FlightCtx, to: FlightCtx) {
	logger.info(
		`Collecting data for ${airline} flights from: ` +
			`${from.airport}  ${formatDate(from.earliest, DateFormatters.Human)} -> ${formatDate(from.latest, DateFormatters.Human)}, ` +
			`to: ${to.airport}  ${formatDate(to.earliest, DateFormatters.Human)} -> ${formatDate(to.latest, DateFormatters.Human)}`,
	);

	await setUpDb();

	const page = await setUpPuppeteer();
	const ctx = new Ctx(createRyanAirURL(from, to), airline, from, to, page);
	await openFlight(ctx);
	logger.info(`Loaded ${ctx.url}`);

	const [departCalendar, returnCalendar] = await getMonthContainers(ctx);

	// the UI opens with both departure and return fligths set to the eariest month:
	// Departure: <from.earliest> | Return: <from.earliest>

	// first collect return flight, bc the ui can be kept consistent (consider scenario where to.earliest is before the month the departure flight taht is being scrapped)
	logger.info("Extracting return data");
	await saveData(await extractData(ctx, to, returnCalendar), ctx, to.airport, from.airport);
	logger.info("Saved return data");
	// Departure: <from.earliest> | Return: <to.latest>

	logger.info("Extracting departure data");
	await saveData(await extractData(ctx, from, departCalendar), ctx, from.airport, to.airport);
	logger.info("Saved departure data");
	// Departure: <from.latest> | Return: <to.latest>

	await disposePuppeteer();
}

async function extractData(ctx: Ctx, flight: FlightCtx, calendar: ElementHandle<Element>) {
	const data: CollectedData = [];

	for (const month of getMonthLables(flight.earliest, flight.latest)) {
		try {
			await switchMonth(ctx, calendar, month);
		} catch (err) {
			logger.error(err);
			continue;
		}

		logger.info("Calendar switched to " + month);
		data.push({ label: month, content: await extractMonthData(ctx, calendar) });
		logger.info("Extracted data from " + month);
	}
	return data;
}

async function saveData(data: CollectedData, ctx: Ctx, fromAirport: string, toAirport: string) {
	for (const { label, content } of data) {
		const [month, year] = label.split(" ");

		if (!month || !year) throw `Incorrect label: ${label}`;
		const yearInt = parseInt(year);
		const monthInt = MONTHS.indexOf(month);
		if (isNaN(yearInt) || isNaN(monthInt)) throw `Incorrect label: ${label}`;

		for (const { date, price } of content) {
			await save(ctx.airline, new Date(yearInt, monthInt, date), price, fromAirport, toAirport);
		}
	}
}

collectData(
	Airline.Ryanair,
	new FlightCtx("EIN", new Date(2026, 5, 25), new Date(2026, 6, 25)),
	new FlightCtx("SOF", new Date(2026, 7, 20), new Date(2026, 8, 8)),
);
