"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middlewares/validate");
const category_schema_1 = require("../schemas/category.schema");
const category_controller_1 = require("../controllers/category.controller");
const isAuth_middleware_1 = require("../middlewares/isAuth.middleware");
const categoryRoutes = (0, express_1.Router)();
categoryRoutes.use(isAuth_middleware_1.isAuth, (0, isAuth_middleware_1.restrictTo)('ADMIN', 'EDITOR'));
categoryRoutes.route('/').post((0, validate_1.validate)(category_schema_1.createCategorySchema), category_controller_1.createCategoryHandler).get(category_controller_1.allCategoriesHandler);
categoryRoutes
    .route('/:categoryId')
    .get(category_controller_1.oneCategoryHandler)
    .put((0, validate_1.validate)(category_schema_1.updateCategorySchema), category_controller_1.updateCategoryHandler)
    .delete(category_controller_1.deleteCategoryHandler);
exports.default = categoryRoutes;
