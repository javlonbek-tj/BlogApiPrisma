"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const appError_1 = __importDefault(require("../utils/appError"));
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            params: req.params,
            query: req.query,
            body: req.body,
        });
        next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            next(appError_1.default.BadRequest('Validation Error', e.errors));
        }
        else {
            next(e);
        }
    }
};
exports.validate = validate;
