import { User } from '@prisma/client';
import ApiError from '../utils/appError';
import db from '../utils/db';
import { getUserSelectFields } from '../utils/getUserSelectedField';

const changedPasswordAfter = (JWTTimestamp: number, passwordChangedAt: Date | null): boolean => {
  if (passwordChangedAt) {
    const changedTimestamp: number = passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const findOne = async (userId: string) => {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!userId) {
    throw ApiError.BadRequest('User not Found');
  }
  return user;
};

const visitUserProfile = async (userId: string, viewerId: string) => {
  const userToBeViewed = await db.user.findUnique({
    where: { id: userId },
    select: getUserSelectFields(),
  });
  if (userToBeViewed && viewerId) {
    const isUserAlreadyViewed = userToBeViewed.viewers.find(viewer => viewer.id === viewerId);
    if (isUserAlreadyViewed) {
      return userToBeViewed;
    }
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        viewers: {
          set: [...userToBeViewed.viewers.map(v => ({ id: v.id })), { id: viewerId }],
        },
      },
      select: getUserSelectFields(),
    });
    return updatedUser;
  }
  throw ApiError.BadRequest('User not found');
};

const followUser = async (followedUserId: string, followingUserId: string) => {
  const userToBeFollowed = await db.user.findUnique({ where: { id: followedUserId }, select: getUserSelectFields() });
  const followingUser = await db.user.findUnique({ where: { id: followingUserId }, select: getUserSelectFields() });
  if (userToBeFollowed && followingUser) {
    const isUserAlreadyFollowed = followingUser.followings.find(following => following.id === followedUserId);
    if (isUserAlreadyFollowed) {
      throw new ApiError(400, 'You have already followed this user');
    }
    await db.user.update({
      where: { id: followedUserId },
      data: {
        followers: {
          set: [...userToBeFollowed.followers.map(f => ({ id: f.id })), { id: followingUserId }],
        },
      },
    });
    const updatedFollowingUser = await db.user.update({
      where: { id: followingUserId },
      data: {
        followings: {
          set: [...followingUser.followings.map(f => ({ id: f.id })), { id: followedUserId }],
        },
      },
      select: getUserSelectFields(),
    });
    return updatedFollowingUser;
  }
  throw ApiError.BadRequest('User not found');
};

export { visitUserProfile, changedPasswordAfter, followUser };
