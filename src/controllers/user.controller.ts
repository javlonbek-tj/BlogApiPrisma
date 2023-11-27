import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';

export const visitUserProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userToBeViewed = await userService.visitUserProfile(req.params.id, req.userId);
    res.status(200).json({
      status: 'success',
      user: userToBeViewed,
    });
  } catch (e) {
    next(e);
  }
};

export const followerUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followingUser = await userService.followUser(req.params.id, req.userId);
    res.status(200).json({
      status: 'success',
      user: followingUser,
    });
  } catch (e) {
    next(e);
  }
};

export const unFollowerUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unFollowingUser = await userService.unFollowUser(req.params.id, req.userId);
    res.status(200).json({
      status: 'success',
      user: unFollowingUser,
    });
  } catch (e) {
    next(e);
  }
};

export const blockUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockingUser = await userService.blockUser(req.params.id, req.userId);
    res.status(200).json({
      status: 'success',
      user: blockingUser,
    });
  } catch (e) {
    next(e);
  }
};

export const unBlockUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const unBlockingUser = await userService.unBlockUser(req.params.id, req.userId);
    res.status(200).json({
      status: 'success',
      user: unBlockingUser,
    });
  } catch (e) {
    next(e);
  }
};

export const adminBlockUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blockedUser = await userService.adminBlockUser(req.params.id);
    res.status(200).json({
      status: 'success',
      user: blockedUser,
    });
  } catch (e) {
    next(e);
  }
};
