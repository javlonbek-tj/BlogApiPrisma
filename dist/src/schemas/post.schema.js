"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostSchema = exports.updatePostSchema = exports.getPostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: 'title is required',
            invalid_type_error: 'title must be a string',
        })
            .trim(),
        description: zod_1.z
            .string({
            required_error: 'description is required',
            invalid_type_error: 'description must be a string',
        })
            .trim(),
        photo: zod_1.z.string({
            required_error: 'photo is required',
            invalid_type_error: 'photo must be a string',
        }),
        categories: zod_1.z.array(zod_1.z.string()),
    }),
});
const params = {
    params: zod_1.z.object({
        postId: zod_1.z.string(),
    }),
};
exports.getPostSchema = zod_1.z.object(Object.assign({}, params));
exports.updatePostSchema = zod_1.z.object(Object.assign(Object.assign({}, params), { body: zod_1.z.object({
        title: zod_1.z
            .string({
            invalid_type_error: 'title must be a string',
        })
            .trim()
            .optional(),
        description: zod_1.z
            .string({
            invalid_type_error: 'description must be a string',
        })
            .trim()
            .optional(),
        photo: zod_1.z
            .string({
            invalid_type_error: 'photo must be a string',
        })
            .optional(),
        categories: zod_1.z.array(zod_1.z.string()).optional(),
    }) }));
exports.deletePostSchema = zod_1.z.object(Object.assign({}, params));
