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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.signin = exports.activate = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
require("dotenv/config");
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = __importDefault(require("../utils/db"));
const tokenService = __importStar(require("./token.service"));
const getSelectedField_1 = require("../utils/getSelectedField");
const signup = async ({ firstname, lastname, email, password, role }) => {
    const isUserExists = await db_1.default.user.findUnique({
        where: { email },
    });
    if (isUserExists) {
        throw appError_1.default.BadRequest(`${email} is already taken`);
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const activationLink = (0, uuid_1.v4)();
    const user = await db_1.default.user.create({
        data: {
            firstname,
            lastname,
            email,
            activationLink,
            password: hashedPassword,
            role,
        },
        select: (0, getSelectedField_1.getUserSelectFields)(),
    });
    const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
    await tokenService.saveToken(user.id, tokens.refreshToken);
    return Object.assign(Object.assign({}, tokens), { user });
};
exports.signup = signup;
const activate = async (activationLink) => {
    const user = await db_1.default.user.findFirst({ where: { activationLink } });
    if (!user) {
        throw appError_1.default.BadRequest('Incorrect activationLink');
    }
    await db_1.default.user.update({
        where: { id: user.id },
        data: {
            isActivated: true,
        },
    });
};
exports.activate = activate;
const signin = async (input) => {
    const existingUser = await db_1.default.user.findUnique({
        where: { email: input.email },
        select: (0, getSelectedField_1.getUserSelectFields)(true),
    });
    if (!existingUser) {
        throw appError_1.default.BadRequest('Email or password incorrect');
    }
    const isPassCorrect = await bcryptjs_1.default.compare(input.password, existingUser.password);
    if (!isPassCorrect) {
        throw appError_1.default.BadRequest('Email or password incorrect');
    }
    const tokens = tokenService.generateTokens({ id: existingUser.id, email: existingUser.email });
    await tokenService.saveToken(existingUser.id, tokens.refreshToken);
    const { password } = existingUser, user = __rest(existingUser, ["password"]);
    return Object.assign(Object.assign({}, tokens), { user });
};
exports.signin = signin;
const signout = (refreshToken) => {
    return tokenService.removeToken(refreshToken);
};
exports.signout = signout;
