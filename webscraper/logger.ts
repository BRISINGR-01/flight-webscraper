import winston from "winston";

const levels = {
	error: 0,
	warn: 1,
	info: 2,
};

export const logger = winston.createLogger({
	levels,
	level: "info",
	format: winston.format.combine(winston.format.json(), winston.format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" })),
	transports: [
		new winston.transports.Console({ level: "info" }),
		new winston.transports.File({ filename: "artifacts/error.log", level: "error" }),
	],
});
