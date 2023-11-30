"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.getCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be a string',
        })
            .trim(),
    }),
});
const params = {
    params: zod_1.z.object({
        categoryId: zod_1.z.string(),
    }),
};
exports.getCategorySchema = zod_1.z.object(Object.assign({}, params));
exports.updateCategorySchema = zod_1.z.object(Object.assign(Object.assign({}, params), { body: zod_1.z.object({
        title: zod_1.z
            .string({
            invalid_type_error: 'Title must be a string',
        })
            .trim()
            .optional(),
    }) }));
