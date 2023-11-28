import { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import config from 'config';
import * as authService from '../services/auth.service';

const cookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions: {
    maxAge: number;
    httpOnly: boolean;
    secure?: boolean;
  } = {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
  };
  if (isProduction) {
    cookieOptions.secure = true;
  }
  return cookieOptions;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.signup(req.body);
    res.cookie('jwt', userData.refreshToken, cookieOptions());
    return res.status(201).json({
      status: 'success',
      userData,
    });
  } catch (e) {
    next(e);
  }
};

export const activateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    authService.activate(req.params.activationLink);
    return res.redirect(config.get<string>('clientUrl'));
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.signin(req.body);
    res.cookie('jwt', userData.refreshToken, cookieOptions());
    return res.status(200).json({
      status: 'success',
      userData,
    });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jwt } = req.cookies;
    await authService.signout(jwt);
    res.clearCookie('jwt');
    return res.status(200).json({
      status: 'success',
      message: 'You have successfully logged out',
    });
  } catch (e) {
    next(e);
  }
};
