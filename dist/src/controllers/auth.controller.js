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
exports.logout = exports.login = exports.activateUser = exports.register = void 0;
require("dotenv/config");
const config_1 = __importDefault(require("config"));
const authService = __importStar(require("../services/auth.service"));
const cookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    };
    if (isProduction) {
        cookieOptions.secure = true;
    }
    return cookieOptions;
};
const register = async (req, res, next) => {
    try {
        const userData = await authService.signup(req.body);
        res.cookie('jwt', userData.refreshToken, cookieOptions());
        return res.status(201).json({
            status: 'success',
            userData,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.register = register;
const activateUser = (req, res, next) => {
    try {
        authService.activate(req.params.activationLink);
        return res.redirect(config_1.default.get('clientUrl'));
    }
    catch (e) {
        next(e);
    }
};
exports.activateUser = activateUser;
const login = async (req, res, next) => {
    try {
        const userData = await authService.signin(req.body);
        res.cookie('jwt', userData.refreshToken, cookieOptions());
        return res.status(200).json({
            status: 'success',
            userData,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.login = login;
const logout = async (req, res, next) => {
    try {
        const { jwt } = req.cookies;
        await authService.signout(jwt);
        res.clearCookie('jwt');
        return res.status(200).json({
            status: 'success',
            message: 'You have successfully logged out',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.logout = logout;
