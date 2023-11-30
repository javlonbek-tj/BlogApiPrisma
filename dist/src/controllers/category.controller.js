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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.oneCategoryHandler = exports.allCategoriesHandler = exports.createCategoryHandler = void 0;
const categoryService = __importStar(require("../services/category.service"));
const createCategoryHandler = async (req, res, next) => {
    try {
        const category = await categoryService.create(req.body);
        return res.status(201).json({
            status: 'success',
            data: category,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.createCategoryHandler = createCategoryHandler;
const allCategoriesHandler = async (req, res, next) => {
    try {
        const categories = await categoryService.allCategories();
        return res.status(200).json({
            status: 'success',
            data: categories,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.allCategoriesHandler = allCategoriesHandler;
const oneCategoryHandler = async (req, res, next) => {
    try {
        const category = await categoryService.oneCategory(req.params.categoryId);
        return res.status(200).json({
            status: 'success',
            data: category,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.oneCategoryHandler = oneCategoryHandler;
const updateCategoryHandler = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(req.params.categoryId, req.body);
        return res.status(200).json({
            status: 'success',
            data: category,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.updateCategoryHandler = updateCategoryHandler;
const deleteCategoryHandler = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(req.params.categoryId);
        return res.status(204).json({
            status: 'success',
            message: 'Category has been deleted successfully',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteCategoryHandler = deleteCategoryHandler;
