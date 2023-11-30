"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleDisLikes = exports.toggleLikes = exports.deletepost = exports.updatePost = exports.onePost = exports.allPosts = exports.create = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = __importDefault(require("../utils/db"));
const getSelectedField_1 = require("../utils/getSelectedField");
const create = async (authorId, { title, description, photo, categories }) => {
    const user = await db_1.default.user.findUnique({ where: { id: authorId } });
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new appError_1.default(403, 'Your account is blocked');
    }
    const post = await db_1.default.post.create({
        data: {
            title,
            description,
            photo,
            authorId,
            category: {
                connect: categories.map(category => ({ id: category })),
            },
        },
    });
    return post;
};
exports.create = create;
const allPosts = async (userId) => {
    const posts = await db_1.default.post.findMany({
        include: {
            author: {
                select: (0, getSelectedField_1.getUserSelectFields)(),
            },
            likes: {
                select: {
                    id: true,
                },
            },
            dislikes: {
                select: {
                    id: true,
                },
            },
            numViews: {
                select: {
                    id: true,
                },
            },
            comments: {
                select: {
                    id: true,
                },
            },
            category: {
                select: {
                    title: true,
                },
            },
        },
    });
    const filteredPosts = posts.filter(post => {
        const blockingUsers = post.author.blockings.map(blocking => blocking.id);
        const isBlocked = blockingUsers.includes(userId);
        return isBlocked ? null : post;
    });
    return filteredPosts;
};
exports.allPosts = allPosts;
const onePost = async (postId, userId) => {
    const post = await db_1.default.post.findUnique({
        where: { id: postId },
        include: (0, getSelectedField_1.getPostInclude)(),
    });
    if (!post) {
        throw appError_1.default.BadRequest('Post not Found');
    }
    const viewers = post.numViews.map(viewer => viewer.id);
    const isViewed = viewers.includes(userId);
    if (isViewed) {
        return post;
    }
    const updatedPost = await db_1.default.post.update({
        where: { id: postId },
        data: {
            numViews: {
                connect: { id: userId },
            },
        },
        include: (0, getSelectedField_1.getPostInclude)(),
    });
    return updatedPost;
};
exports.onePost = onePost;
const updatePost = async (postId, userId, input) => {
    const post = await db_1.default.post.findUnique({ where: { id: postId } });
    if (!post) {
        throw appError_1.default.BadRequest('Post not Found');
    }
    if (post.authorId !== userId) {
        throw appError_1.default.UnauthorizedError();
    }
    const dataToUpdate = {};
    if (input.title !== undefined) {
        dataToUpdate.title = input.title;
    }
    if (input.description !== undefined) {
        dataToUpdate.description = input.description;
    }
    if (input.photo !== undefined) {
        dataToUpdate.photo = input.photo;
    }
    if (input.categories !== undefined) {
        dataToUpdate.categories = input.categories;
    }
    return db_1.default.post.update({
        where: { id: postId },
        data: dataToUpdate,
    });
};
exports.updatePost = updatePost;
const deletepost = async (postId, userId) => {
    const post = await db_1.default.post.findUnique({ where: { id: postId } });
    if (!post) {
        throw appError_1.default.BadRequest('Post not Found');
    }
    const user = await db_1.default.user.findUnique({ where: { id: userId } });
    if (post.authorId === userId || (user === null || user === void 0 ? void 0 : user.role) === 'ADMIN') {
        return db_1.default.post.delete({ where: { id: postId } });
    }
    else {
        throw appError_1.default.UnauthorizedError();
    }
};
exports.deletepost = deletepost;
const toggleLikes = async (postId, userId) => {
    const post = await db_1.default.post.findUnique({
        where: { id: postId },
        include: (0, getSelectedField_1.getLikesDislikesInclude)(),
    });
    if (!post) {
        throw appError_1.default.BadRequest('Post not Found');
    }
    const likes = post.likes.map(like => like.id);
    const isLiked = likes.includes(userId);
    if (isLiked) {
        const updatePost = await db_1.default.post.update({
            where: { id: postId },
            data: {
                likes: {
                    disconnect: { id: userId },
                },
            },
            include: (0, getSelectedField_1.getLikesDislikesInclude)(),
        });
        return updatePost;
    }
    return await db_1.default.post.update({
        where: { id: postId },
        data: {
            likes: {
                connect: { id: userId },
            },
            dislikes: {
                disconnect: { id: userId },
            },
        },
        include: (0, getSelectedField_1.getLikesDislikesInclude)(),
    });
};
exports.toggleLikes = toggleLikes;
const toggleDisLikes = async (postId, userId) => {
    const post = await db_1.default.post.findUnique({
        where: { id: postId },
        include: (0, getSelectedField_1.getLikesDislikesInclude)(),
    });
    if (!post) {
        throw appError_1.default.BadRequest('Post not Found');
    }
    const disLikes = post.dislikes.map(dislike => dislike.id);
    const isDisLiked = disLikes.includes(userId);
    if (isDisLiked) {
        const updatePost = await db_1.default.post.update({
            where: { id: postId },
            data: {
                dislikes: {
                    disconnect: { id: userId },
                },
            },
            include: (0, getSelectedField_1.getLikesDislikesInclude)(),
        });
        return updatePost;
    }
    return await db_1.default.post.update({
        where: { id: postId },
        data: {
            dislikes: {
                connect: { id: userId },
            },
            likes: {
                disconnect: { id: userId },
            },
        },
        include: (0, getSelectedField_1.getLikesDislikesInclude)(),
    });
};
exports.toggleDisLikes = toggleDisLikes;
