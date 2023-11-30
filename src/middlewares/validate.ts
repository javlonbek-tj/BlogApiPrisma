import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
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
      if (req.file) {
        const filePath = req.file.path;
        fs.unlink(filePath, err => {
          if (err) {
            throw new Error('Error while deleting file');
          }
        });
      }
    } else {
      next(e);
    }
  }
};
