import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { createPostSchema, deletePostSchema, getPostSchema, updatePostSchema } from '../schemas/post.schema';
import { allPostsHandler, createPostHandler, deletePostHandler, onePostHandler, updatePostHandler } from '../controllers/post.controller';
import { isAuth, restrictTo } from '../middlewares/isAuth.middleware';

const postRoutes = Router();

postRoutes.route('/').post(isAuth, validate(createPostSchema), createPostHandler).get(allPostsHandler);

postRoutes
  .route('/:postId')
  .get(onePostHandler)
  .put(validate(updatePostSchema), isAuth, updatePostHandler)
  .delete(isAuth, restrictTo('ADMIN', 'USER'), deletePostHandler);

export default postRoutes;
