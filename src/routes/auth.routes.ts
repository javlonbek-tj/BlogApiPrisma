import { Router } from 'express';
import { activateUser, login, logout, register } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';

const authRoutes = Router();

authRoutes.post('/signup', validate(createUserSchema), register);
authRoutes.post('/login', validate(loginUserSchema), login);
authRoutes.get('/activate/:activationLink', activateUser);
authRoutes.post('/logout', logout);

export default authRoutes;
