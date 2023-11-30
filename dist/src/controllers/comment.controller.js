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
exports.deleteCommentHandler = exports.updateCommentHandler = exports.getAllCommentsHandler = exports.createCommentHandler = void 0;
const commentService = __importStar(require("../services/comment.service"));
const createCommentHandler = async (req, res, next) => {
    try {
        const comment = await commentService.create(req.userId, req.body);
        return res.status(201).json({
            status: 'success',
            data: comment,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.createCommentHandler = createCommentHandler;
const getAllCommentsHandler = async (req, res, next) => {
    try {
        const comments = await commentService.allComments(req.params.postId);
        return res.status(200).json({
            status: 'success',
            data: comments,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getAllCommentsHandler = getAllCommentsHandler;
const updateCommentHandler = async (req, res, next) => {
    try {
        const updatedComment = await commentService.updateComment(req.userId, req.params.commentId, req.body);
        return res.status(200).json({
            status: 'success',
            data: updatedComment,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.updateCommentHandler = updateCommentHandler;
const deleteCommentHandler = async (req, res, next) => {
    try {
        await commentService.deleteComment(req.userId, req.params.commentId);
        return res.status(204).json({
            status: 'success',
            message: 'Comment has been deleted successfully',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteCommentHandler = deleteCommentHandler;
