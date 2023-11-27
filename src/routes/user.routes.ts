import { Router } from 'express';
import {
  adminBlockUserHandler,
  blockUserHandler,
  followerUserHandler,
  unBlockUserHandler,
  unFollowerUserHandler,
  visitUserProfileHandler,
} from '../controllers/user.controller';
import { isAuth, restrictTo } from '../middlewares/isAuth.middleware';

const userRoutes = Router();

userRoutes.get('/profile-viewers/:id', isAuth, visitUserProfileHandler);
userRoutes.get('/following/:id', isAuth, followerUserHandler);
userRoutes.get('/unfollowing/:id', isAuth, unFollowerUserHandler);
userRoutes.get('/blocking/:id', isAuth, blockUserHandler);
userRoutes.get('/unblocking/:id', isAuth, unBlockUserHandler);
userRoutes.put('/admin-block/:id', isAuth, restrictTo('ADMIN'), adminBlockUserHandler);

export default userRoutes;
