"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
const config_1 = __importDefault(require("config"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.default.get('NODEMAILER_USER'),
        pass: config_1.default.get('NODEMAILER_PASS'),
    },
});
const sendMail = (to, subject, html) => {
    transporter.sendMail({
        from: config_1.default.get('NODEMAILER_USER'),
        to,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
