import puppeteer, { type Browser, type ElementHandle } from "puppeteer";
import { type Ctx } from "./utils";

let browser: Browser;
export async function setUpPuppeteer() {
	browser = await puppeteer.launch({
		headless: true,
		defaultViewport: null,
		devtools: true,
	});

	return await browser.newPage();
}

export async function disposePuppeteer() {
	await browser.close();
}

export async function extractMonthData(ctx: Ctx, month: ElementHandle<Element>) {
	try {
		await ctx.page.waitForSelector(".priced-date__date");
	} catch {
		throw "Couldn't find date prices";
	}

	const data: { date: number; price: number }[] = [];

	for (const btn of await month.$$(".priced-date__date")) {
		const dateEl = await btn.$(".priced-date__date--number");
		if (!dateEl) continue;

		const date = await dateEl.evaluate((el) => parseInt(el.innerHTML));
		if (isNaN(date)) continue;

		const priceEl = await btn.$(".price__integers");
		if (!priceEl) continue;

		const price = await priceEl.evaluate((el) => parseInt(el.innerHTML));
		if (isNaN(price)) continue;

		data.push({ date, price });
	}

	return data;
}

export async function getMonthContainers(ctx: Ctx) {
	const monthSelector = ".calendar-month__month";
	try {
		await ctx.page.waitForSelector(monthSelector);
	} catch {
		throw "Couldn't find any month calendar elements";
	}

	const months = await ctx.page.$$(monthSelector);

	if (months.length !== 2) throw "Couldn't find exactly 2 month calendar elements";

	return months as [ElementHandle<Element>, ElementHandle<Element>];
}

export async function switchMonth(ctx: Ctx, month: ElementHandle<Element>, monthLabel: string) {
	// skip if already selected
	if ((await month.$eval(".dropdown__toggle-text", ({ innerHTML }) => innerHTML)) === monthLabel) return;

	const dropdown = await month.$(".dropdown__toggle");
	if (!dropdown) throw "Could not find dropdown";

	await dropdown.click();

	const links = await month.$$(".dropdown-item__label");

	let link;
	for (const l of links) {
		if ((await l.evaluate(({ innerHTML }) => innerHTML)).includes(monthLabel)) {
			link = l;
		}
	}

	if (!link) throw `Could not find link for ${monthLabel}`;

	await link.click();

	await ctx.page.waitForSelector(`.dropdown__toggle-text ::-p-text("${monthLabel}")`);
}

export async function openFlight(ctx: Ctx) {
	await ctx.page.goto(ctx.url, { waitUntil: "domcontentloaded" });

	removeCookies(ctx); // do not wait, as it is optional
}

export async function removeCookies(ctx: Ctx) {
	try {
		const cookies = await ctx.page.waitForSelector("#cookie-popup-with-overlay");
		cookies?.evaluate((el) => el.remove());
	} catch {}
}
