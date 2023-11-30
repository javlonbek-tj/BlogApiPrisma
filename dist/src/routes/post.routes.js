"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../middlewares/validate");
const post_schema_1 = require("../schemas/post.schema");
const post_controller_1 = require("../controllers/post.controller");
const isAuth_middleware_1 = require("../middlewares/isAuth.middleware");
const postRoutes = (0, express_1.Router)();
postRoutes.route('/').post(isAuth_middleware_1.isAuth, (0, validate_1.validate)(post_schema_1.createPostSchema), post_controller_1.createPostHandler).get(isAuth_middleware_1.isAuth, post_controller_1.allPostsHandler);
postRoutes
    .route('/:postId')
    .get(isAuth_middleware_1.isAuth, post_controller_1.onePostHandler)
    .put((0, validate_1.validate)(post_schema_1.updatePostSchema), isAuth_middleware_1.isAuth, post_controller_1.updatePostHandler)
    .delete(isAuth_middleware_1.isAuth, (0, isAuth_middleware_1.restrictTo)('ADMIN', 'USER'), post_controller_1.deletePostHandler);
postRoutes.put('/likes/:postId', isAuth_middleware_1.isAuth, post_controller_1.toggleLikesHandler);
postRoutes.put('/dislikes/:postId', isAuth_middleware_1.isAuth, post_controller_1.toggleDIsLikesHandler);
exports.default = postRoutes;
