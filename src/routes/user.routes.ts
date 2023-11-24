import { Router } from 'express';
import { followerUserHandler, visitUserProfileHandler } from '../controllers/user.controller';
import { isAuth } from '../middlewares/isAuth.middleware';

const userRoutes = Router();

userRoutes.get('/profile-viewers/:id', isAuth, visitUserProfileHandler);
userRoutes.get('/following/:id', isAuth, followerUserHandler);

export default userRoutes;
