import { Router } from 'express';
import { activateUser, login, logout, register, reSendCode } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import { isAuth } from '../middlewares/isAuth.middleware';

const authRoutes = Router();

authRoutes.post('/signup', validate(createUserSchema), register);
authRoutes.post('/login', validate(loginUserSchema), login);
authRoutes.patch('/resend', reSendCode);
authRoutes.patch('/activate', activateUser);
authRoutes.post('/logout', isAuth, logout);

export default authRoutes;
