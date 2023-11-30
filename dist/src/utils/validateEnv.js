"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        PORT: (0, envalid_1.port)(),
        DATABASE_URL: (0, envalid_1.str)(),
        CLIENT_URL: (0, envalid_1.str)(),
        JWT_ACCESS_SECRET: (0, envalid_1.str)(),
        JWT_REFRESH_SECRET: (0, envalid_1.str)(),
        ACCESS_TOKEN_EXPIRES_IN: (0, envalid_1.str)(),
        REFRESH_TOKEN_EXPIRES_IN: (0, envalid_1.str)(),
    });
};
exports.default = validateEnv;
