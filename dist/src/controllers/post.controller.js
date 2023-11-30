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
exports.toggleDIsLikesHandler = exports.toggleLikesHandler = exports.deletePostHandler = exports.updatePostHandler = exports.onePostHandler = exports.allPostsHandler = exports.createPostHandler = void 0;
const postService = __importStar(require("../services/post.service"));
const fileUpload_1 = __importDefault(require("../services/fileUpload"));
const appError_1 = __importDefault(require("../utils/appError"));
const createPostHandler = async (req, res, next) => {
    try {
        const fileUploadMiddleware = fileUpload_1.default.single('photo');
        fileUploadMiddleware(req, res, async (err) => {
            var _a;
            if (err) {
                next(appError_1.default.BadRequest('Error while uploading file. Please tri again.'));
            }
            if (!req.file || !req.file.path) {
                next(appError_1.default.BadRequest('Please upload a file!'));
            }
            const photo = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            const post = await postService.create(req.userId, Object.assign(Object.assign({}, req.body), { photo }));
            return res.status(201).json({
                status: 'success',
                data: post,
            });
        });
    }
    catch (e) {
        next(e);
    }
};
exports.createPostHandler = createPostHandler;
const allPostsHandler = async (req, res, next) => {
    try {
        const posts = await postService.allPosts(req.userId);
        return res.status(200).json({
            status: 'success',
            data: posts,
            numberOfPosts: posts.length,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.allPostsHandler = allPostsHandler;
const onePostHandler = async (req, res, next) => {
    try {
        const post = await postService.onePost(req.params.postId, req.userId);
        return res.status(200).json({
            status: 'success',
            data: post,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.onePostHandler = onePostHandler;
const updatePostHandler = async (req, res, next) => {
    try {
        const post = await postService.updatePost(req.params.postId, req.userId, req.body);
        return res.status(200).json({
            status: 'success',
            data: post,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.updatePostHandler = updatePostHandler;
const deletePostHandler = async (req, res, next) => {
    try {
        await postService.deletepost(req.params.postId, req.userId);
        return res.status(204).json({
            status: 'success',
            message: 'Post has been deleted successfully',
        });
    }
    catch (e) {
        next(e);
    }
};
exports.deletePostHandler = deletePostHandler;
const toggleLikesHandler = async (req, res, next) => {
    try {
        const post = await postService.toggleLikes(req.params.postId, req.userId);
        return res.status(200).json({
            status: 'success',
            data: post,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.toggleLikesHandler = toggleLikesHandler;
const toggleDIsLikesHandler = async (req, res, next) => {
    try {
        const post = await postService.toggleDisLikes(req.params.postId, req.userId);
        return res.status(200).json({
            status: 'success',
            data: post,
        });
    }
    catch (e) {
        next(e);
    }
};
exports.toggleDIsLikesHandler = toggleDIsLikesHandler;
