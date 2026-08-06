import "__debugger_recorder";
const __fn_id = "0";
import type { ElementHandle } from "puppeteer";
import { save, setUpDb } from "../data/db.ts";
import { logger } from "../data/logger.ts";
import { disposePuppeteer, extractMonthData, getMonthContainers, openFlight, setUpPuppeteer, switchMonth } from "./puppeteer.ts";
import { Airline, createRyanAirURL, Ctx, DateFormatters, FlightCtx, formatDate, enumerateMonths, MONTHS_LABELS, type CollectedData } from "../data/utils.ts";
async function collectData(airline: Airline, departureFlight: FlightCtx, arrivalFlight: FlightCtx) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "collectData",
    args: [{
      name: "airline",
      type: typeof airline,
      value: airline
    }, {
      name: "departureFlight",
      type: typeof departureFlight,
      value: departureFlight
    }, {
      name: "arrivalFlight",
      type: typeof arrivalFlight,
      value: arrivalFlight
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:24:0",
    fn_id: __fn_id
  });
  try {
    if ((__recorder__.emit({
      event: "call",
      callee: "arrivalFlight.from.getTime",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:29:6",
      fn_id: __fn_id
    }), arrivalFlight.from.getTime()) < (__recorder__.emit({
      event: "call",
      callee: "departureFlight.from.getTime",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:29:37",
      fn_id: __fn_id
    }), departureFlight.from.getTime())) {
      throw new Error("Arrival cannot be earlier than departure");
    }
    __recorder__.emit({
      event: "call",
      callee: "logger.info",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:33:2",
      fn_id: __fn_id
    });
    logger.info(`Collecting data for ${airline} flights from: ` + `${departureFlight.airport}  ${__recorder__.emit({
      event: "call",
      callee: "formatDate",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:35:37",
      fn_id: __fn_id
    }), formatDate(departureFlight.from, DateFormatters.Human)} -> ${__recorder__.emit({
      event: "call",
      callee: "formatDate",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:35:98",
      fn_id: __fn_id
    }), formatDate(departureFlight.to, DateFormatters.Human)}, ` + `to: ${arrivalFlight.airport}  ${__recorder__.emit({
      event: "call",
      callee: "formatDate",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:36:39",
      fn_id: __fn_id
    }), formatDate(arrivalFlight.from, DateFormatters.Human)} -> ${__recorder__.emit({
      event: "call",
      callee: "formatDate",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:36:98",
      fn_id: __fn_id
    }), formatDate(arrivalFlight.to, DateFormatters.Human)}`);
    await (__recorder__.emit({
      event: "call",
      callee: "setUpDb",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:39:8",
      fn_id: __fn_id
    }), setUpDb());
    const page = await (__recorder__.emit({
      event: "call",
      callee: "setUpPuppeteer",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:41:21",
      fn_id: __fn_id
    }), setUpPuppeteer());
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "page",
        type: "const",
        value: page
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:41:2",
      fn_id: __fn_id
    });
    const ctx: Ctx = {
      url: (__recorder__.emit({
        event: "call",
        callee: "createRyanAirURL",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:43:9",
        fn_id: __fn_id
      }), createRyanAirURL(departureFlight, arrivalFlight)),
      airline,
      from: departureFlight,
      to: arrivalFlight,
      page
    };
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "ctx",
        type: "const",
        value: ctx
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:42:2",
      fn_id: __fn_id
    });
    await (__recorder__.emit({
      event: "call",
      callee: "openFlight",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:50:8",
      fn_id: __fn_id
    }), openFlight(ctx));
    __recorder__.emit({
      event: "call",
      callee: "logger.info",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:51:2",
      fn_id: __fn_id
    });
    logger.info(`Loaded ${ctx.url}`);
    const [departCalendar, returnCalendar] = await (__recorder__.emit({
      event: "call",
      callee: "getMonthContainers",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:53:49",
      fn_id: __fn_id
    }), getMonthContainers(ctx));

    // the UI opens with both departure and return fligths set to the eariest month:
    // Departure: <from.earliest> | Return: <from.earliest>

    // first collect return flight, bc the ui can be kept consistent (consider scenario where to.earliest is before the month the departure flight that is being scrapped)
    __recorder__.emit({
      event: "call",
      callee: "logger.info",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:59:2",
      fn_id: __fn_id
    });
    logger.info("Extracting return data");
    await (__recorder__.emit({
      event: "call",
      callee: "saveData",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:60:8",
      fn_id: __fn_id
    }), saveData(await (__recorder__.emit({
      event: "call",
      callee: "extractData",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:61:10",
      fn_id: __fn_id
    }), extractData(ctx, arrivalFlight, returnCalendar)), ctx, arrivalFlight.airport, departureFlight.airport));
    __recorder__.emit({
      event: "call",
      callee: "logger.info",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:66:2",
      fn_id: __fn_id
    });
    logger.info("Saved return data");
    // Departure: <from.earliest> | Return: <to.latest>
    __recorder__.emit({
      event: "call",
      callee: "logger.info",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:69:2",
      fn_id: __fn_id
    });
    logger.info("Extracting departure data");
    await (__recorder__.emit({
      event: "call",
      callee: "saveData",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:70:8",
      fn_id: __fn_id
    }), saveData(await (__recorder__.emit({
      event: "call",
      callee: "extractData",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:71:10",
      fn_id: __fn_id
    }), extractData(ctx, departureFlight, departCalendar)), ctx, departureFlight.airport, arrivalFlight.airport));
    __recorder__.emit({
      event: "call",
      callee: "logger.info",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:76:2",
      fn_id: __fn_id
    });
    logger.info("Saved departure data");
    // Departure: <from.latest> | Return: <to.latest>

    await (__recorder__.emit({
      event: "call",
      callee: "disposePuppeteer",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:79:8",
      fn_id: __fn_id
    }), disposePuppeteer());
    __recorder__.emit({
      event: "exit",
      returnVal: undefined,
      fn_id: __fn_id
    });
  } catch (__err_1__) {
    __recorder__.emit({
      event: "throw",
      error: __err_1__,
      fn_id: __fn_id
    });
    throw __err_1__;
  }
}
async function extractData(ctx: Ctx, flight: FlightCtx, calendar: ElementHandle<Element>) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "extractData",
    args: [{
      name: "ctx",
      type: typeof ctx,
      value: ctx
    }, {
      name: "flight",
      type: typeof flight,
      value: flight
    }, {
      name: "calendar",
      type: typeof calendar,
      value: calendar
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:82:0",
    fn_id: __fn_id
  });
  try {
    const data: CollectedData = [];
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "data",
        type: "const",
        value: data
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:87:2",
      fn_id: __fn_id
    });
    for (const {
      month,
      year
    } of (__recorder__.emit({
      event: "call",
      callee: "enumerateMonths",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:89:32",
      fn_id: __fn_id
    }), enumerateMonths(flight.from, flight.to))) {
      const label = `${MONTHS_LABELS[month]} ${year}`;
      __recorder__.emit({
        event: "declare",
        variable: {
          name: "label",
          type: "const",
          value: label
        },
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:90:4",
        fn_id: __fn_id
      });
      try {
        await (__recorder__.emit({
          event: "call",
          callee: "switchMonth",
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:92:12",
          fn_id: __fn_id
        }), switchMonth(ctx, calendar, label));
      } catch (err) {
        __recorder__.emit({
          event: "call",
          callee: "logger.error",
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:94:6",
          fn_id: __fn_id
        });
        logger.error(err);
        continue;
      }
      __recorder__.emit({
        event: "call",
        callee: "logger.info",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:98:4",
        fn_id: __fn_id
      });
      logger.info("Calendar switched to " + label);
      __recorder__.emit({
        event: "call",
        callee: "data.push",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:99:4",
        fn_id: __fn_id
      });
      data.push({
        month,
        year,
        content: await (__recorder__.emit({
          event: "call",
          callee: "extractMonthData",
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:99:44",
          fn_id: __fn_id
        }), extractMonthData(ctx, calendar))
      });
      __recorder__.emit({
        event: "call",
        callee: "logger.info",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:100:4",
        fn_id: __fn_id
      });
      logger.info("Extracted data from " + label);
    }
    const __return_val = data;
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:102:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_3__) {
    __recorder__.emit({
      event: "throw",
      error: __err_3__,
      fn_id: __fn_id
    });
    throw __err_3__;
  }
}
async function saveData(data: CollectedData, ctx: Ctx, fromAirport: string, toAirport: string) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "saveData",
    args: [{
      name: "data",
      type: typeof data,
      value: data
    }, {
      name: "ctx",
      type: typeof ctx,
      value: ctx
    }, {
      name: "fromAirport",
      type: typeof fromAirport,
      value: fromAirport
    }, {
      name: "toAirport",
      type: typeof toAirport,
      value: toAirport
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:105:0",
    fn_id: __fn_id
  });
  try {
    for (const {
      month,
      year,
      content
    } of data) {
      for (const {
        date,
        price
      } of content) {
        await (__recorder__.emit({
          event: "call",
          callee: "save",
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:113:12",
          fn_id: __fn_id
        }), save(ctx.airline, new Date(year, month, date), price, fromAirport, toAirport));
      }
    }
    __recorder__.emit({
      event: "exit",
      returnVal: undefined,
      fn_id: __fn_id
    });
  } catch (__err_5__) {
    __recorder__.emit({
      event: "throw",
      error: __err_5__,
      fn_id: __fn_id
    });
    throw __err_5__;
  }
}
__recorder__.emit({
  event: "call",
  callee: "collectData",
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:124:0",
  fn_id: __fn_id
});
collectData(Airline.Ryanair, (__recorder__.emit({
  event: "call",
  callee: "createFlight",
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:126:2",
  fn_id: __fn_id
}), createFlight("EIN", new Date(2026, 11, 10), new Date(2027, 11, 27))), (__recorder__.emit({
  event: "call",
  callee: "createFlight",
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:127:2",
  fn_id: __fn_id
}), createFlight("SOF", new Date(2027, 0, 1), new Date(2027, 0, 15))));
function createFlight(airport: string, from: Date, to: Date): FlightCtx {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "createFlight",
    args: [{
      name: "airport",
      type: typeof airport,
      value: airport
    }, {
      name: "from",
      type: typeof from,
      value: from
    }, {
      name: "to",
      type: typeof to,
      value: to
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:130:0",
    fn_id: __fn_id
  });
  try {
    const now = new Date();
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "now",
        type: "const",
        value: now
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:131:2",
      fn_id: __fn_id
    });
    const nowMS = (__recorder__.emit({
      event: "call",
      callee: "Date.getTime",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:132:16",
      fn_id: __fn_id
    }), now.getTime());
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "nowMS",
        type: "const",
        value: nowMS
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:132:2",
      fn_id: __fn_id
    });
    if ((__recorder__.emit({
      event: "call",
      callee: "to.getTime",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:134:6",
      fn_id: __fn_id
    }), to.getTime()) < nowMS) throw new Error("Flight dates are in the past");
    let __old_0__ = undefined;
    if ((__recorder__.emit({
      event: "call",
      callee: "from.getTime",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:136:6",
      fn_id: __fn_id
    }), from.getTime()) < nowMS) __old_0__ = from, from = now, __recorder__.emit({
      event: "change",
      variable: {
        name: "from",
        type: "kind",
        value: from
      },
      oldValue: __old_0__,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:136:30",
      fn_id: __fn_id
    }), from;
    if ((__recorder__.emit({
      event: "call",
      callee: "to.getTime",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:137:6",
      fn_id: __fn_id
    }), to.getTime()) < (__recorder__.emit({
      event: "call",
      callee: "from.getTime",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:137:21",
      fn_id: __fn_id
    }), from.getTime())) throw new Error("Arrival cannot be earlier than departure");
    const __return_val = {
      airport,
      from,
      to
    };
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/scraper/index.ts:140:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_7__) {
    __recorder__.emit({
      event: "throw",
      error: __err_7__,
      fn_id: __fn_id
    });
    throw __err_7__;
  }
}