import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import ApiError from '../utils/appError';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      params: req.params,
      query: req.query,
      body: req.body,
    });
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      next(ApiError.BadRequest('Validation Error', e.errors));
    } else {
      next(e);
    }
  }
};
