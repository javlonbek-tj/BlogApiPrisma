import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/appError';
import * as tokenService from '../services/token.service';
import db from '../utils/db';
import { changedPasswordAfter } from '../services/user.service';

declare global {
  namespace Express {
    interface Request {
      user: string;
    }
  }
}

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthenticatedError());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthenticatedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    const currentUser = await db.user.findUnique({ where: { id: userData.id } });
    if (!currentUser) {
      return next(ApiError.UnauthenticatedError());
    }
    if (changedPasswordAfter(userData.iat, currentUser.passwordChangedAt)) {
      return next(new ApiError(401, 'User recently changed password. Please login again'));
    }
    req.user = currentUser.id;
    next();
  } catch (e) {
    return next(ApiError.UnauthenticatedError());
  }
};
