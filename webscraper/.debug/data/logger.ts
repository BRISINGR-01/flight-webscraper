import "__debugger_recorder";
const __fn_id = "0";
import winston from "winston";
const levels = {
  error: 0,
  warn: 1,
  info: 2
};
__recorder__.emit({
  event: "declare",
  variable: {
    name: "levels",
    type: "const",
    value: levels
  },
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/logger.ts:3:0",
  fn_id: __fn_id
});
export const logger = (__recorder__.emit({
  event: "call",
  callee: "winston.createLogger",
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/logger.ts:9:22",
  fn_id: __fn_id
}), winston.createLogger({
  levels,
  level: "info",
  format: (__recorder__.emit({
    event: "call",
    callee: "winston.format.combine",
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/logger.ts:12:9",
    fn_id: __fn_id
  }), winston.format.combine((__recorder__.emit({
    event: "call",
    callee: "winston.format.json",
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/logger.ts:12:32",
    fn_id: __fn_id
  }), winston.format.json()), (__recorder__.emit({
    event: "call",
    callee: "winston.format.timestamp",
    loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/logger.ts:12:55",
    fn_id: __fn_id
  }), winston.format.timestamp({
    format: "YYYY-MM-DD hh:mm:ss A"
  })))),
  transports: [new winston.transports.Console({
    level: "info"
  }), new winston.transports.File({
    filename: "artifacts/error.log",
    level: "error"
  })]
}));
__recorder__.emit({
  event: "declare",
  variable: {
    name: "logger",
    type: "const",
    value: logger
  },
  loc: "/home/alex/Desktop/VSC/ryanair/webscraper/data/logger.ts:9:7",
  fn_id: __fn_id
});