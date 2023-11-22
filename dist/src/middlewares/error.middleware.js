"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const logger_1 = __importDefault(require("../utils/logger"));
function errorMiddleware(err, req, res, next) {
    if (err instanceof appError_1.default) {
        return res
            .status(err.statusCode)
            .json({ status: err.status, message: err.message, errors: err.errors });
    }
    logger_1.default.error(err);
    return res.status(500).json({ status: err.status, message: err.message });
}
exports.default = errorMiddleware;
