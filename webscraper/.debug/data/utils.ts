import "__debugger_recorder";
const __fn_id = "0";
import type { Page } from "puppeteer";
export type FlightCtx = {
  airport: string;
  from: Date;
  to: Date;
};
export type Ctx = {
  url: string;
  airline: Airline;
  from: FlightCtx;
  to: FlightCtx;
  page: Page;
};
export enum DateFormatters {
  Ryanair,
  Human
}
export function formatDate(date: Date, format: DateFormatters) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "formatDate",
    args: [{
      name: "date",
      type: typeof date,
      value: date
    }, {
      name: "format",
      type: typeof format,
      value: format
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:22:7",
    fn_id: __fn_id
  });
  try {
    switch (format) {
      case DateFormatters.Ryanair:
        {
          const __return_val = `${__recorder__.emit({
            event: "call",
            callee: "date.getFullYear",
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:25:16",
            fn_id: __fn_id
          }), date.getFullYear()}-${(__recorder__.emit({
            event: "call",
            callee: "date.getMonth",
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:25:38",
            fn_id: __fn_id
          }), date.getMonth()) + 1}-${__recorder__.emit({
            event: "call",
            callee: "date.getDate",
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:25:61",
            fn_id: __fn_id
          }), date.getDate()}`;
          __recorder__.emit({
            event: "exit",
            returnVal: __return_val,
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:25:6",
            fn_id: __fn_id
          });
          return __return_val;
        }
      case DateFormatters.Human:
        {}
      default:
        {
          const __return_val = `${__recorder__.emit({
            event: "call",
            callee: "date.getDate",
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:28:16",
            fn_id: __fn_id
          }), date.getDate()} ${__recorder__.emit({
            event: "call",
            callee: "getMonth",
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:28:34",
            fn_id: __fn_id
          }), getMonth(date)} ${__recorder__.emit({
            event: "call",
            callee: "date.getFullYear",
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:28:52",
            fn_id: __fn_id
          }), date.getFullYear()}`;
          __recorder__.emit({
            event: "exit",
            returnVal: __return_val,
            loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:28:6",
            fn_id: __fn_id
          });
          return __return_val;
        }
    }
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
function getMonth(date: Date) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "getMonth",
    args: [{
      name: "date",
      type: typeof date,
      value: date
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:32:0",
    fn_id: __fn_id
  });
  try {
    const __return_val = (__recorder__.emit({
      event: "call",
      callee: "date.toString().split",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:33:9",
      fn_id: __fn_id
    }), (__recorder__.emit({
      event: "call",
      callee: "date.toString",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:33:9",
      fn_id: __fn_id
    }), date.toString()).split(" "))[1];
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:33:2",
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
export function enumerateMonths(start: Date, end: Date) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "enumerateMonths",
    args: [{
      name: "start",
      type: typeof start,
      value: start
    }, {
      name: "end",
      type: typeof end,
      value: end
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:36:7",
    fn_id: __fn_id
  });
  try {
    const data = [];
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "data",
        type: "const",
        value: data
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:37:2",
      fn_id: __fn_id
    });
    const startYear = (__recorder__.emit({
      event: "call",
      callee: "start.getFullYear",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:38:20",
      fn_id: __fn_id
    }), start.getFullYear());
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "startYear",
        type: "const",
        value: startYear
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:38:2",
      fn_id: __fn_id
    });
    let __old_0__ = year;
    for (let year = startYear; year <= (__recorder__.emit({
      event: "call",
      callee: "end.getFullYear",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:40:37",
      fn_id: __fn_id
    }), end.getFullYear()); year++, __recorder__.emit({
      event: "assign",
      variable: {
        name: "year",
        type: "kind",
        value: year
      },
      oldValue: __old_0__,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:40:56",
      fn_id: __fn_id
    }), year) {
      const beginingMonth = startYear === year ? (__recorder__.emit({
        event: "call",
        callee: "start.getMonth",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:41:47",
        fn_id: __fn_id
      }), start.getMonth()) : 0;
      __recorder__.emit({
        event: "declare",
        variable: {
          name: "beginingMonth",
          type: "const",
          value: beginingMonth
        },
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:41:4",
        fn_id: __fn_id
      });
      const endMonth = (__recorder__.emit({
        event: "call",
        callee: "end.getFullYear",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:42:21",
        fn_id: __fn_id
      }), end.getFullYear()) === year ? (__recorder__.emit({
        event: "call",
        callee: "end.getMonth",
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:42:50",
        fn_id: __fn_id
      }), end.getMonth()) : 11;
      __recorder__.emit({
        event: "declare",
        variable: {
          name: "endMonth",
          type: "const",
          value: endMonth
        },
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:42:4",
        fn_id: __fn_id
      });
      let __old_1__ = month;
      for (let month = beginingMonth; month <= endMonth; month++, __recorder__.emit({
        event: "assign",
        variable: {
          name: "month",
          type: "kind",
          value: month
        },
        oldValue: __old_1__,
        loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:44:55",
        fn_id: __fn_id
      }), month) {
        __recorder__.emit({
          event: "call",
          callee: "data.push",
          loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:45:6",
          fn_id: __fn_id
        });
        data.push({
          month,
          year
        });
      }
    }
    const __return_val = data;
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:49:2",
      fn_id: __fn_id
    });
    return __return_val;
  } catch (__err_5__) {
    __recorder__.emit({
      event: "throw",
      error: __err_5__,
      fn_id: __fn_id
    });
    throw __err_5__;
  }
}
export function createRyanAirURL(from: FlightCtx, to: FlightCtx) {
  const __fn_id = __recorder__.genId();
  __recorder__.emit({
    event: "enter",
    function_name: "createRyanAirURL",
    args: [{
      name: "from",
      type: typeof from,
      value: from
    }, {
      name: "to",
      type: typeof to,
      value: to
    }],
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:52:7",
    fn_id: __fn_id
  });
  try {
    const country = "nl";
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "country",
        type: "const",
        value: country
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:53:2",
      fn_id: __fn_id
    });
    const language = "en";
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "language",
        type: "const",
        value: language
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:54:2",
      fn_id: __fn_id
    });
    const url = new URL(`https://www.ryanair.com/${country}/${language}/fare-finder`);
    __recorder__.emit({
      event: "declare",
      variable: {
        name: "url",
        type: "const",
        value: url
      },
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:55:2",
      fn_id: __fn_id
    });
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:59:2",
      fn_id: __fn_id
    });
    url.searchParams.append("originIata", from.airport);
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:60:2",
      fn_id: __fn_id
    });
    url.searchParams.append("destinationIata", to.airport);
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:61:2",
      fn_id: __fn_id
    });
    url.searchParams.append("isReturn", "true");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:62:2",
      fn_id: __fn_id
    });
    url.searchParams.append("isMacDestination", "false");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:63:2",
      fn_id: __fn_id
    });
    url.searchParams.append("promoCode", "");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:64:2",
      fn_id: __fn_id
    });
    url.searchParams.append("adults", "1");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:65:2",
      fn_id: __fn_id
    });
    url.searchParams.append("teens", "0");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:66:2",
      fn_id: __fn_id
    });
    url.searchParams.append("children", "0");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:67:2",
      fn_id: __fn_id
    });
    url.searchParams.append("infants", "0");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:68:2",
      fn_id: __fn_id
    });
    url.searchParams.append("dateOut", (__recorder__.emit({
      event: "call",
      callee: "formatDate",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:70:4",
      fn_id: __fn_id
    }), formatDate(from.from, DateFormatters.Ryanair)));
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:72:2",
      fn_id: __fn_id
    });
    url.searchParams.append("dateIn", (__recorder__.emit({
      event: "call",
      callee: "formatDate",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:74:4",
      fn_id: __fn_id
    }), formatDate(to.from, DateFormatters.Ryanair)));
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:76:2",
      fn_id: __fn_id
    });
    url.searchParams.append("daysTrip", "31");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:77:2",
      fn_id: __fn_id
    });
    url.searchParams.append("nightsFrom", "30");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:78:2",
      fn_id: __fn_id
    });
    url.searchParams.append("nightsTo", "31");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:79:2",
      fn_id: __fn_id
    });
    url.searchParams.append("dayOfWeek", "");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:80:2",
      fn_id: __fn_id
    });
    url.searchParams.append("isExactDate", "false");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:81:2",
      fn_id: __fn_id
    });
    url.searchParams.append("outboundFromHour", "00:00");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:82:2",
      fn_id: __fn_id
    });
    url.searchParams.append("outboundToHour", "23:59");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:83:2",
      fn_id: __fn_id
    });
    url.searchParams.append("inboundFromHour", "00:00");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:84:2",
      fn_id: __fn_id
    });
    url.searchParams.append("inboundToHour", "23:59");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:85:2",
      fn_id: __fn_id
    });
    url.searchParams.append("priceValueTo", "");
    __recorder__.emit({
      event: "call",
      callee: "url.searchParams.append",
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:86:2",
      fn_id: __fn_id
    });
    url.searchParams.append("currency", "EUR");
    const __return_val = url.href;
    __recorder__.emit({
      event: "exit",
      returnVal: __return_val,
      loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:88:2",
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
export enum Airline {
  Ryanair = "Ryanair"
}
export const MONTHS_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
__recorder__.emit({
  event: "declare",
  variable: {
    name: "MONTHS_LABELS",
    type: "const",
    value: MONTHS_LABELS
  },
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:95:7",
  fn_id: __fn_id
});
export type CollectedData = {
  month: number;
  year: number;
  content: {
    date: number;
    price: number;
  }[];
}[];
export const AIRPORTS = [{
  code: "SOF",
  name: "Sofia"
}, {
  code: "EIN",
  name: "Eindhoven"
}];
__recorder__.emit({
  event: "declare",
  variable: {
    name: "AIRPORTS",
    type: "const",
    value: AIRPORTS
  },
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/utils.ts:119:7",
  fn_id: __fn_id
});