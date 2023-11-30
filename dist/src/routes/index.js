"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const post_routes_1 = __importDefault(require("./post.routes"));
const comment_routes_1 = __importDefault(require("./comment.routes"));
const api = (0, express_1.Router)();
api.use('/', auth_routes_1.default);
api.use('/users', user_routes_1.default);
api.use('/categories', category_routes_1.default);
api.use('/posts', post_routes_1.default);
api.use('/comments', comment_routes_1.default);
exports.default = api;
