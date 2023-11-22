"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
winston_1.default.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
});
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
    levels,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf((info) => `${[info.timestamp]}: ${info.level}: ${info.message}`)),
    transports: [
        new winston_1.default.transports.File({
            level: 'error',
            filename: 'logs/error.log',
            maxsize: 10000000,
            maxFiles: 10,
        }),
        new winston_1.default.transports.File({
            filename: 'logs/combined.log',
            maxsize: 10000000,
            maxFiles: 10,
        }),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true })),
        }),
    ],
});
exports.default = logger;
