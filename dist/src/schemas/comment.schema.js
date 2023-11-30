"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.getCommentSchema = exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: zod_1.z
            .string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string',
        })
            .trim(),
        postId: zod_1.z.string(),
    }),
});
const params = {
    params: zod_1.z.object({
        commentId: zod_1.z.string(),
    }),
};
exports.getCommentSchema = zod_1.z.object(Object.assign({}, params));
exports.updateCommentSchema = zod_1.z.object(Object.assign(Object.assign({}, params), { body: zod_1.z.object({
        description: zod_1.z
            .string({
            invalid_type_error: 'Description must be a string',
        })
            .trim()
            .optional(),
    }) }));
