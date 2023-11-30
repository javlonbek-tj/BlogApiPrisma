"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.isAuth = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const tokenService = __importStar(require("../services/token.service"));
const db_1 = __importDefault(require("../utils/db"));
const user_service_1 = require("../services/user.service");
const isAuth = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(appError_1.default.UnauthenticatedError());
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(appError_1.default.UnauthenticatedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);
        const currentUser = await db_1.default.user.findUnique({ where: { id: userData.id } });
        if (!currentUser) {
            return next(appError_1.default.UnauthenticatedError());
        }
        if ((0, user_service_1.changedPasswordAfter)(userData.iat, currentUser.passwordChangedAt)) {
            return next(new appError_1.default(401, 'User recently changed password. Please login again'));
        }
        req.userId = currentUser.id;
        next();
    }
    catch (e) {
        return next(appError_1.default.UnauthenticatedError());
    }
};
exports.isAuth = isAuth;
function restrictTo(...roles) {
    return async (req, res, next) => {
        const user = await db_1.default.user.findUnique({ where: { id: req.userId } });
        if (user && !roles.includes(user.role)) {
            return next(appError_1.default.UnauthorizedError());
        }
        next();
    };
}
exports.restrictTo = restrictTo;
