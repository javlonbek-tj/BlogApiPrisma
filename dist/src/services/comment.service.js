"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComment = exports.deleteComment = exports.allComments = exports.create = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = __importDefault(require("../utils/db"));
const getSelectedField_1 = require("../utils/getSelectedField");
const create = async (userId, { description, postId }) => {
    const post = await db_1.default.post.findUnique({
        where: { id: postId },
        select: {
            author: {
                select: {
                    blockings: true,
                },
            },
        },
    });
    if (!post) {
        throw appError_1.default.BadRequest('Post not Found');
    }
    const blockings = post.author.blockings.map(blocking => blocking.id);
    const isBlocked = blockings.includes(userId);
    if (isBlocked) {
        throw new appError_1.default(403, `You can not leave a comment to this post. You are blocked by the author of the post.`);
    }
    const comment = await db_1.default.comment.create({
        data: {
            description,
            postId,
            userId,
        },
        include: {
            post: true,
            user: {
                select: (0, getSelectedField_1.getUserSelectFields)(),
            },
        },
    });
    return comment;
};
exports.create = create;
const allComments = (postId) => {
    return db_1.default.comment.findMany({
        where: { postId: postId },
        include: {
            user: {
                select: (0, getSelectedField_1.getUserSelectFields)(),
            },
        },
    });
};
exports.allComments = allComments;
const updateComment = async (userId, commentId, { description }) => {
    const comment = await db_1.default.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw appError_1.default.BadRequest('Comment not Found');
    }
    if (userId !== comment.userId) {
        throw appError_1.default.UnauthorizedError();
    }
    return await db_1.default.comment.update({
        where: { id: commentId },
        data: {
            description,
        },
        include: {
            user: {
                select: (0, getSelectedField_1.getUserSelectFields)(),
            },
        },
    });
};
exports.updateComment = updateComment;
const deleteComment = async (userId, commentId) => {
    const comment = await db_1.default.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
        throw appError_1.default.BadRequest('Comment not Found');
    }
    if (userId !== comment.userId) {
        throw appError_1.default.UnauthorizedError();
    }
    await db_1.default.comment.delete({ where: { id: commentId } });
};
exports.deleteComment = deleteComment;
