"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeToken = exports.findToken = exports.saveToken = exports.validateRefreshToken = exports.validateAccessToken = exports.generateTokens = void 0;
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const db_1 = __importDefault(require("../utils/db"));
const generateTokens = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.get('accessTokenKey'), {
        expiresIn: config_1.default.get('accessTokenExpiresIn'),
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.default.get('refreshTokenKey'), {
        expiresIn: config_1.default.get('refreshTokenExpiresIn'),
    });
    return {
        accessToken,
        refreshToken,
    };
};
exports.generateTokens = generateTokens;
const validateAccessToken = (token) => {
    const userData = jsonwebtoken_1.default.verify(token, config_1.default.get('accessTokenKey'));
    return userData;
};
exports.validateAccessToken = validateAccessToken;
const validateRefreshToken = (token) => {
    const userData = jsonwebtoken_1.default.verify(token, config_1.default.get('refreshTokenKey'));
    return userData;
};
exports.validateRefreshToken = validateRefreshToken;
const saveToken = async (userId, refreshToken) => {
    const tokenData = await db_1.default.token.findUnique({ where: { userId } });
    if (tokenData) {
        const updatedTokenData = await db_1.default.token.update({
            where: { userId },
            data: {
                refreshToken,
            },
        });
        return updatedTokenData;
    }
    const token = await db_1.default.token.create({
        data: {
            userId,
            refreshToken,
        },
    });
    return token;
};
exports.saveToken = saveToken;
const findToken = async (refreshToken) => {
    const tokenData = await db_1.default.token.findFirst({ where: { refreshToken } });
    return tokenData;
};
exports.findToken = findToken;
const removeToken = async (refreshToken) => {
    const tokenData = await db_1.default.token.findFirst({ where: { refreshToken } });
    if (tokenData) {
        await db_1.default.token.delete({ where: { id: tokenData.id } });
    }
    return tokenData;
};
exports.removeToken = removeToken;
