"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let db;
if (!global.__db) {
    global.__db = new client_1.PrismaClient();
}
db = global.__db;
exports.default = db;
