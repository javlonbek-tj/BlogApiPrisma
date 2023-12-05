import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/appError';
import * as tokenService from '../services/token.service';
import db from '../utils/db';
import { changedPasswordAfter } from '../services/user.service';
import { RoleEnumType } from '../schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      userId: string;
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
    if (!currentUser.isActivated) {
      return next(ApiError.UnauthenticatedError());
    }
    if (changedPasswordAfter(userData.iat, currentUser.passwordChangedAt)) {
      return next(new ApiError(401, 'User recently changed password. Please login again'));
    }
    req.userId = currentUser.id;
    next();
  } catch (e) {
    return next(ApiError.UnauthenticatedError());
  }
};

type UserRole = keyof typeof RoleEnumType;

export function restrictTo(...roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await db.user.findUnique({ where: { id: req.userId } });
    if (user && !roles.includes(user.role)) {
      return next(ApiError.UnauthorizedError());
    }
    next();
  };
}
