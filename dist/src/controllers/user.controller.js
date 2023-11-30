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
exports.deleteAccountHanlder = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.changeUserPasswordHandler = exports.updateUserInfoHandler = exports.adminUnBlockUserHandler = exports.adminBlockUserHandler = exports.unBlockUserHandler = exports.blockUserHandler = exports.unFollowerUserHandler = exports.followerUserHandler = exports.oneUserHandler = exports.visitUserProfileHandler = void 0;
const userService = __importStar(require("../services/user.service"));
const visitUserProfileHandler = async (req, res, next) => {
    try {
        const userToBeViewed = await userService.visitUserProfile(req.params.id, req.userId);
        res.status(200).json({
            status: 'success',
            data: userToBeViewed,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.visitUserProfileHandler = visitUserProfileHandler;
const oneUserHandler = async (req, res, next) => {
    try {
        const user = await userService.findOne(req.params.userId);
        res.status(200).json({
            status: 'success',
            data: user,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.oneUserHandler = oneUserHandler;
const followerUserHandler = async (req, res, next) => {
    try {
        const followingUser = await userService.followUser(req.params.id, req.userId);
        res.status(200).json({
            status: 'success',
            data: followingUser,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.followerUserHandler = followerUserHandler;
const unFollowerUserHandler = async (req, res, next) => {
    try {
        const unFollowingUser = await userService.unFollowUser(req.params.id, req.userId);
        res.status(200).json({
            status: 'success',
            data: unFollowingUser,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.unFollowerUserHandler = unFollowerUserHandler;
const blockUserHandler = async (req, res, next) => {
    try {
        const blockingUser = await userService.blockUser(req.params.id, req.userId);
        res.status(200).json({
            status: 'success',
            data: blockingUser,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.blockUserHandler = blockUserHandler;
const unBlockUserHandler = async (req, res, next) => {
    try {
        const unBlockingUser = await userService.unBlockUser(req.params.id, req.userId);
        res.status(200).json({
            status: 'success',
            data: unBlockingUser,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.unBlockUserHandler = unBlockUserHandler;
const adminBlockUserHandler = async (req, res, next) => {
    try {
        const blockedUser = await userService.adminBlockUser(req.params.id);
        res.status(200).json({
            status: 'success',
            data: blockedUser,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.adminBlockUserHandler = adminBlockUserHandler;
const adminUnBlockUserHandler = async (req, res, next) => {
    try {
        const unBlockedUser = await userService.adminUnBlockUser(req.params.id);
        res.status(200).json({
            status: 'success',
            data: unBlockedUser,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.adminUnBlockUserHandler = adminUnBlockUserHandler;
const updateUserInfoHandler = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUserInfo(req.userId, req.body);
        res.status(200).json({
            status: 'success',
            data: updatedUser,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.updateUserInfoHandler = updateUserInfoHandler;
const changeUserPasswordHandler = async (req, res, next) => {
    try {
        await userService.changeUserPassword(req.userId, req.body);
        res.status(200).json({
            status: 'success',
            message: 'You have successfully changed your password!',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.changeUserPasswordHandler = changeUserPasswordHandler;
const forgotPasswordHandler = async (req, res, next) => {
    try {
        const { email } = req.body;
        await userService.forgotPassword(email);
        res.status(200).json({
            status: 'success',
            message: 'ResetToken sent to your email!',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.forgotPasswordHandler = forgotPasswordHandler;
const resetPasswordHandler = async (req, res, next) => {
    try {
        await userService.resetPassword(req.params.resetToken, req.body);
        res.status(200).json({
            status: 'success',
            message: 'You have successfully changed your password!',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.resetPasswordHandler = resetPasswordHandler;
const deleteAccountHanlder = async (req, res, next) => {
    try {
        await userService.deleteAccount(req.userId);
        res.status(204).json({
            status: 'success',
            message: 'User has been deleted successfully',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteAccountHanlder = deleteAccountHanlder;
