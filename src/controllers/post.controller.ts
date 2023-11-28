import { NextFunction, Request, Response } from 'express';
import * as postService from '../services/post.service';
import { CreatePostInput, DeletePostInput, GetPostInput, UpdatePostInput } from '../schemas/post.schema';

export const createPostHandler = async (req: Request<{}, {}, CreatePostInput>, res: Response, next: NextFunction) => {
  try {
    const post = await postService.create(req.userId, req.body);
    return res.status(201).json({
      status: 'success',
      data: post,
    });
  } catch (e) {
    next(e);
  }
};

export const allPostsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await postService.allPosts();
    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (e) {
    next(e);
  }
};

export const onePostHandler = async (req: Request<GetPostInput>, res: Response, next: NextFunction) => {
  try {
    const post = await postService.onePost(req.params.postId);
    return res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (e) {
    next(e);
  }
};

export const updatePostHandler = async (req: Request<GetPostInput, {}, UpdatePostInput>, res: Response, next: NextFunction) => {
  try {
    const post = await postService.updatePost(req.params.postId, req.body);
    return res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (e) {
    next(e);
  }
};

export const deletePostHandler = async (req: Request<DeletePostInput>, res: Response, next: NextFunction) => {
  try {
    await postService.deletepost(req.params.postId);
    return res.status(200).json({
      status: 'success',
      message: 'Post has been deleted successfully',
    });
  } catch (e) {
    next(e);
  }
};
