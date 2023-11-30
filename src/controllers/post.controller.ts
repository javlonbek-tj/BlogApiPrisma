import { NextFunction, Request, Response } from 'express';
import * as postService from '../services/post.service';
import { CreatePostInput, DeletePostInput, GetPostInput, UpdatePostInput } from '../schemas/post.schema';
import upload from '../utils/fileUpload';

export const fileUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const singleUpload = upload.single('photo');
  singleUpload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        status: 'fail',
        message: 'Error while uploading file. Please try again!',
      });
    }
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please upload a file!',
      });
    }
    next();
  });
};

export const createPostHandler = async (req: Request<{}, {}, CreatePostInput>, res: Response, next: NextFunction) => {
  try {
    const photo = req.file?.path;
    if (!photo) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please upload a file!',
      });
    }
    const post = await postService.create(req.userId, photo, req.body);
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
    const posts = await postService.allPosts(req.userId);
    return res.status(200).json({
      status: 'success',
      data: posts,
      numberOfPosts: posts.length,
    });
  } catch (e) {
    next(e);
  }
};

export const onePostHandler = async (req: Request<GetPostInput>, res: Response, next: NextFunction) => {
  try {
    const post = await postService.onePost(req.params.postId, req.userId);
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
    const post = await postService.updatePost(req.params.postId, req.userId, req.body);
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
    await postService.deletepost(req.params.postId, req.userId);
    return res.status(204).json({
      status: 'success',
      message: 'Post has been deleted successfully',
    });
  } catch (e) {
    next(e);
  }
};

export const toggleLikesHandler = async (req: Request<GetPostInput>, res: Response, next: NextFunction) => {
  try {
    const post = await postService.toggleLikes(req.params.postId, req.userId);
    return res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (e) {
    next(e);
  }
};

export const toggleDIsLikesHandler = async (req: Request<GetPostInput>, res: Response, next: NextFunction) => {
  try {
    const post = await postService.toggleDisLikes(req.params.postId, req.userId);
    return res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (e) {
    next(e);
  }
};
