import { getUserSchema, updatePasswordSchema, updateUserSchema } from './../schemas/user.schema';
import { Router } from 'express';
import {
  adminBlockUserHandler,
  adminUnBlockUserHandler,
  blockUserHandler,
  changeUserPasswordHandler,
  deleteAccountHanlder,
  followerUserHandler,
  forgotPasswordHandler,
  oneUserHandler,
  resetPasswordHandler,
  unBlockUserHandler,
  unFollowerUserHandler,
  updateUserInfoHandler,
  visitUserProfileHandler,
} from '../controllers/user.controller';
import { isAuth, restrictTo } from '../middlewares/isAuth.middleware';
import { validate } from '../middlewares/validate';

const userRoutes = Router();

userRoutes.get('/:userId', isAuth, oneUserHandler);

userRoutes.get('/profile-viewers/:id', isAuth, visitUserProfileHandler);

userRoutes.get('/following/:id', isAuth, followerUserHandler);

userRoutes.get('/unfollowing/:id', isAuth, unFollowerUserHandler);

userRoutes.get('/blocking/:id', isAuth, blockUserHandler);

userRoutes.get('/unblocking/:id', isAuth, unBlockUserHandler);

userRoutes.put('/admin-block/:id', isAuth, restrictTo('ADMIN'), adminBlockUserHandler);

userRoutes.put('/admin-unblock/:id', isAuth, restrictTo('ADMIN'), adminUnBlockUserHandler);

userRoutes.put('/', isAuth, validate(updateUserSchema), updateUserInfoHandler);

userRoutes.put('/change-password', isAuth, validate(updatePasswordSchema), changeUserPasswordHandler);

userRoutes.post('/forgot-password', isAuth, forgotPasswordHandler);

userRoutes.put('/reset-password/:resetToken', isAuth, resetPasswordHandler);

userRoutes.delete('/delete-account', isAuth, deleteAccountHanlder);

export default userRoutes;
