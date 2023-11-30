"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.oneCategory = exports.allCategories = exports.create = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = __importDefault(require("../utils/db"));
const create = async ({ title }) => {
    const categoryExists = await db_1.default.category.findUnique({ where: { title } });
    if (categoryExists) {
        throw appError_1.default.BadRequest('Category already exists');
    }
    const category = await db_1.default.category.create({
        data: {
            title,
        },
    });
    return category;
};
exports.create = create;
const allCategories = async () => {
    const categories = await db_1.default.category.findMany();
    return categories;
};
exports.allCategories = allCategories;
const oneCategory = async (id) => {
    const category = await db_1.default.category.findUnique({ where: { id } });
    if (!category) {
        throw appError_1.default.BadRequest('Category not Found');
    }
    return category;
};
exports.oneCategory = oneCategory;
const updateCategory = async (id, { title }) => {
    const category = await db_1.default.category.findUnique({ where: { id } });
    if (!category) {
        throw appError_1.default.BadRequest('Category not Found');
    }
    const categoryExists = await db_1.default.category.findUnique({ where: { title } });
    if (categoryExists) {
        throw appError_1.default.BadRequest('Category already exists');
    }
    return db_1.default.category.update({
        where: { id },
        data: {
            title,
        },
    });
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    const category = await db_1.default.category.findUnique({ where: { id } });
    if (!category) {
        throw appError_1.default.BadRequest('Category not Found');
    }
    return db_1.default.category.delete({ where: { id } });
};
exports.deleteCategory = deleteCategory;
