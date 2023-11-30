"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostInclude = exports.getLikesDislikesInclude = exports.getUserSelectFields = void 0;
const getUserSelectFields = (includePassword = false) => ({
    id: true,
    firstname: true,
    lastname: true,
    profilPhoto: true,
    email: true,
    isBlocked: true,
    role: true,
    userAward: true,
    isActivated: true,
    viewers: { select: { id: true } },
    followers: { select: { id: true } },
    followings: { select: { id: true } },
    posts: { select: { id: true } },
    comments: { select: { id: true } },
    blockings: { select: { id: true } },
    password: includePassword,
    createdAt: true,
    updatedAt: true,
});
exports.getUserSelectFields = getUserSelectFields;
const getLikesDislikesInclude = () => ({
    likes: { select: { id: true } },
    dislikes: { select: { id: true } },
});
exports.getLikesDislikesInclude = getLikesDislikesInclude;
const getPostInclude = () => ({
    author: { select: (0, exports.getUserSelectFields)() },
    likes: { select: (0, exports.getUserSelectFields)() },
    dislikes: { select: (0, exports.getUserSelectFields)() },
    numViews: { select: (0, exports.getUserSelectFields)() },
    comments: true,
    category: { select: { title: true } },
});
exports.getPostInclude = getPostInclude;
