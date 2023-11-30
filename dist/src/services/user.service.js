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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.resetPassword = exports.forgotPassword = exports.changeUserPassword = exports.updateUserInfo = exports.adminUnBlockUser = exports.adminBlockUser = exports.unBlockUser = exports.blockUser = exports.unFollowUser = exports.followUser = exports.changedPasswordAfter = exports.visitUserProfile = exports.findOne = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
require("dotenv/config");
const config_1 = __importDefault(require("config"));
const appError_1 = __importDefault(require("../utils/appError"));
const db_1 = __importDefault(require("../utils/db"));
const getSelectedField_1 = require("../utils/getSelectedField");
const tokenService = __importStar(require("./token.service"));
const changedPasswordAfter = (JWTTimestamp, passwordChangedAt) => {
    if (passwordChangedAt) {
        const changedTimestamp = passwordChangedAt.getTime() / 1000;
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};
exports.changedPasswordAfter = changedPasswordAfter;
const createPasswordResetToken = async (email) => {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const passwordResetToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await db_1.default.user.update({
        where: { email },
        data: {
            passwordResetToken,
            passwordResetExpires,
        },
    });
    return resetToken;
};
const findOne = async (userId) => {
    const user = await db_1.default.user.findUnique({ where: { id: userId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    if (!user) {
        throw appError_1.default.BadRequest('User not Found');
    }
    return user;
};
exports.findOne = findOne;
const visitUserProfile = async (userId, viewerId) => {
    const userToBeViewed = await db_1.default.user.findUnique({
        where: { id: userId },
        select: (0, getSelectedField_1.getUserSelectFields)(),
    });
    if (userToBeViewed && viewerId) {
        const isUserAlreadyViewed = userToBeViewed.viewers.find(viewer => viewer.id === viewerId);
        if (isUserAlreadyViewed) {
            return userToBeViewed;
        }
        const updatedUser = await db_1.default.user.update({
            where: { id: userId },
            data: {
                viewers: {
                    set: [...userToBeViewed.viewers.map(v => ({ id: v.id })), { id: viewerId }],
                },
            },
            select: (0, getSelectedField_1.getUserSelectFields)(),
        });
        return updatedUser;
    }
    throw appError_1.default.BadRequest('User not found');
};
exports.visitUserProfile = visitUserProfile;
const followUser = async (followedUserId, followingUserId) => {
    const userToBeFollowed = await db_1.default.user.findUnique({ where: { id: followedUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    const followingUser = await db_1.default.user.findUnique({ where: { id: followingUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    if (userToBeFollowed && followingUser) {
        const isUserAlreadyFollowed = followingUser.followings.find(following => following.id === followedUserId);
        if (isUserAlreadyFollowed) {
            throw appError_1.default.BadRequest('You have already followed this user');
        }
        await db_1.default.user.update({
            where: { id: followedUserId },
            data: {
                followers: {
                    set: [...userToBeFollowed.followers.map(f => ({ id: f.id })), { id: followingUserId }],
                },
            },
        });
        const updatedFollowingUser = await db_1.default.user.update({
            where: { id: followingUserId },
            data: {
                followings: {
                    set: [...followingUser.followings.map(f => ({ id: f.id })), { id: followedUserId }],
                },
            },
            select: (0, getSelectedField_1.getUserSelectFields)(),
        });
        return updatedFollowingUser;
    }
    throw appError_1.default.BadRequest('User not found');
};
exports.followUser = followUser;
const unFollowUser = async (unFollowedUserId, unFollowingUserId) => {
    const userToBeUnFollowed = await db_1.default.user.findUnique({ where: { id: unFollowedUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    const unFollowingUser = await db_1.default.user.findUnique({ where: { id: unFollowingUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    if (userToBeUnFollowed && unFollowingUser) {
        const isUserAlreadyUnFollowed = unFollowingUser.followings.find(unFollowing => unFollowing.id === unFollowedUserId);
        if (!isUserAlreadyUnFollowed) {
            throw appError_1.default.BadRequest('You have not followed this user');
        }
        await db_1.default.user.update({
            where: { id: unFollowedUserId },
            data: {
                followers: {
                    set: userToBeUnFollowed.followers.filter(follower => follower.id !== unFollowingUserId),
                },
            },
        });
        const updatedUnFollowingUser = await db_1.default.user.update({
            where: { id: unFollowingUserId },
            data: {
                followings: {
                    set: unFollowingUser.followings.filter(following => following.id !== unFollowedUserId),
                },
            },
            select: (0, getSelectedField_1.getUserSelectFields)(),
        });
        return updatedUnFollowingUser;
    }
    throw appError_1.default.BadRequest('User not found');
};
exports.unFollowUser = unFollowUser;
const blockUser = async (blockedUserId, blockingUserId) => {
    const userToBeBlocked = await db_1.default.user.findUnique({ where: { id: blockedUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    const blockingUser = await db_1.default.user.findUnique({ where: { id: blockingUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    if (userToBeBlocked && blockingUser) {
        const isUserAlreadyBlocked = blockingUser.blockings.find(blocking => blocking.id === blockedUserId);
        if (isUserAlreadyBlocked) {
            throw appError_1.default.BadRequest('You have already blocked this user');
        }
        const updatedBlockingUser = await db_1.default.user.update({
            where: { id: blockingUserId },
            data: {
                blockings: {
                    set: [...blockingUser.blockings.map(b => ({ id: b.id })), { id: blockedUserId }],
                },
            },
            select: (0, getSelectedField_1.getUserSelectFields)(),
        });
        return updatedBlockingUser;
    }
    throw appError_1.default.BadRequest('User not found');
};
exports.blockUser = blockUser;
const unBlockUser = async (unBlockedUserId, unBlockingUserId) => {
    const userToBeUnBlocked = await db_1.default.user.findUnique({ where: { id: unBlockedUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    const unBlockingUser = await db_1.default.user.findUnique({ where: { id: unBlockingUserId }, select: (0, getSelectedField_1.getUserSelectFields)() });
    if (userToBeUnBlocked && unBlockingUser) {
        const isUserAlreadyUnBlocked = unBlockingUser.blockings.find(blocking => blocking.id === unBlockedUserId);
        if (!isUserAlreadyUnBlocked) {
            throw appError_1.default.BadRequest('You have not blocked this user');
        }
        const updatedUnBlockingUser = await db_1.default.user.update({
            where: { id: unBlockingUserId },
            data: {
                blockings: {
                    set: unBlockingUser.blockings.filter(unBlocking => unBlocking.id !== unBlockedUserId),
                },
            },
            select: (0, getSelectedField_1.getUserSelectFields)(),
        });
        return updatedUnBlockingUser;
    }
    throw appError_1.default.BadRequest('User not found');
};
exports.unBlockUser = unBlockUser;
const adminBlockUser = async (userId) => {
    const userToBeBlocked = await db_1.default.user.findUnique({ where: { id: userId } });
    if (!userToBeBlocked) {
        throw appError_1.default.BadRequest('User not found');
    }
    if (userToBeBlocked.isBlocked) {
        throw appError_1.default.BadRequest('User already blocked');
    }
    return db_1.default.user.update({
        where: { id: userId },
        data: {
            isBlocked: true,
        },
        select: (0, getSelectedField_1.getUserSelectFields)(),
    });
};
exports.adminBlockUser = adminBlockUser;
const adminUnBlockUser = async (userId) => {
    const userToBeUnBlocked = await db_1.default.user.findUnique({ where: { id: userId } });
    if (!userToBeUnBlocked) {
        throw appError_1.default.BadRequest('User not found');
    }
    if (!userToBeUnBlocked.isBlocked) {
        throw appError_1.default.BadRequest('User is not blocked');
    }
    return db_1.default.user.update({
        where: { id: userId },
        data: {
            isBlocked: false,
        },
        select: (0, getSelectedField_1.getUserSelectFields)(),
    });
};
exports.adminUnBlockUser = adminUnBlockUser;
const updateUserInfo = async (userId, input) => {
    if (input.email) {
        const isEmailTaken = await db_1.default.user.findUnique({ where: { email: input.email } });
        if (isEmailTaken) {
            throw appError_1.default.BadRequest(`${input.email} is already taken`);
        }
    }
    const dataToUpdate = {};
    if (input.firstname !== undefined) {
        dataToUpdate.firstname = input.firstname;
    }
    if (input.lastname !== undefined) {
        dataToUpdate.lastname = input.lastname;
    }
    if (input.email !== undefined) {
        dataToUpdate.email = input.email;
    }
    if (input.profilPhoto !== undefined) {
        dataToUpdate.profilPhoto = input.profilPhoto;
    }
    return db_1.default.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: (0, getSelectedField_1.getUserSelectFields)(),
    });
};
exports.updateUserInfo = updateUserInfo;
const changeUserPassword = async (userId, { oldPass, newPass, newPassConfirm }) => {
    const user = await db_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw appError_1.default.BadRequest('User not Found');
    }
    const isPassEquals = await bcryptjs_1.default.compare(oldPass, user.password);
    if (!isPassEquals) {
        throw appError_1.default.BadRequest('Old password is incorrect');
    }
    if (newPass !== newPassConfirm) {
        throw appError_1.default.BadRequest('New Password and Password Confirmation are not the same');
    }
    const hashPassword = await bcryptjs_1.default.hash(newPass, 10);
    return db_1.default.user.update({
        where: { id: userId },
        data: {
            password: hashPassword,
        },
        select: (0, getSelectedField_1.getUserSelectFields)(),
    });
};
exports.changeUserPassword = changeUserPassword;
const forgotPassword = async (email) => {
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw appError_1.default.BadRequest('User not Found');
    }
    const resetToken = await createPasswordResetToken(email);
    const resetUrl = `${config_1.default.get('apiUrl')}/users/resetPassword/${resetToken}`;
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (resetToken, { password }) => {
    const passwordResetToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    const user = await db_1.default.user.findFirst({
        where: {
            passwordResetToken,
            passwordResetExpires: {
                gt: Date.now(),
            },
        },
    });
    if (!user) {
        throw appError_1.default.BadRequest('Token is invalid or has expired');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    await db_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
            passwordChangedAt: new Date(),
        },
    });
    const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
    await tokenService.saveToken(user.id, tokens.refreshToken);
    return Object.assign(Object.assign({}, tokens), { user });
};
exports.resetPassword = resetPassword;
const deleteAccount = async (userId) => {
    await db_1.default.user.delete({ where: { id: userId } });
};
exports.deleteAccount = deleteAccount;
