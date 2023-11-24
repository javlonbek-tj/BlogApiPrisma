import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';

export const visitUserProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userToBeViewed = await userService.visitUserProfile(req.params.id, req.user);
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
    const followingUser = await userService.followUser(req.params.id, req.user);
    res.status(200).json({
      status: 'success',
      user: followingUser,
    });
  } catch (e) {
    next(e);
  }
};
