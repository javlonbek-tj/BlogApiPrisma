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
      throw ApiError.BadRequest('You have already followed this user');
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

const unFollowUser = async (unFollowedUserId: string, unFollowingUserId: string) => {
  const userToBeUnFollowed = await db.user.findUnique({ where: { id: unFollowedUserId }, select: getUserSelectFields() });
  const unFollowingUser = await db.user.findUnique({ where: { id: unFollowingUserId }, select: getUserSelectFields() });
  if (userToBeUnFollowed && unFollowingUser) {
    const isUserAlreadyUnFollowed = unFollowingUser.followings.find(unFollowing => unFollowing.id === unFollowedUserId);
    if (!isUserAlreadyUnFollowed) {
      throw ApiError.BadRequest('You have not followed this user');
    }
    await db.user.update({
      where: { id: unFollowedUserId },
      data: {
        followers: {
          set: userToBeUnFollowed.followers.filter(follower => follower.id !== unFollowingUserId),
        },
      },
    });
    const updatedUnFollowingUser = await db.user.update({
      where: { id: unFollowingUserId },
      data: {
        followings: {
          set: unFollowingUser.followings.filter(following => following.id !== unFollowedUserId),
        },
      },
      select: getUserSelectFields(),
    });

    return updatedUnFollowingUser;
  }
  throw ApiError.BadRequest('User not found');
};

const blockUser = async (blockedUserId: string, blockingUserId: string) => {
  const userToBeBlocked = await db.user.findUnique({ where: { id: blockedUserId }, select: getUserSelectFields() });
  const blockingUser = await db.user.findUnique({ where: { id: blockingUserId }, select: getUserSelectFields() });
  if (userToBeBlocked && blockingUser) {
    const isUserAlreadyBlocked = blockingUser.blockings.find(blocking => blocking.id === blockedUserId);
    if (isUserAlreadyBlocked) {
      throw ApiError.BadRequest('You have already blocked this user');
    }
    const updatedBlockingUser = await db.user.update({
      where: { id: blockingUserId },
      data: {
        blockings: {
          set: [...blockingUser.blockings.map(b => ({ id: b.id })), { id: blockedUserId }],
        },
      },
      select: getUserSelectFields(),
    });
    return updatedBlockingUser;
  }
  throw ApiError.BadRequest('User not found');
};

const unBlockUser = async (unBlockedUserId: string, unBlockingUserId: string) => {
  const userToBeUnBlocked = await db.user.findUnique({ where: { id: unBlockedUserId }, select: getUserSelectFields() });
  const unBlockingUser = await db.user.findUnique({ where: { id: unBlockingUserId }, select: getUserSelectFields() });
  if (userToBeUnBlocked && unBlockingUser) {
    const isUserAlreadyUnBlocked = unBlockingUser.blockings.find(blocking => blocking.id === unBlockedUserId);
    if (!isUserAlreadyUnBlocked) {
      throw ApiError.BadRequest('You have not blocked this user');
    }
    const updatedUnBlockingUser = await db.user.update({
      where: { id: unBlockingUserId },
      data: {
        blockings: {
          set: unBlockingUser.blockings.filter(unBlocking => unBlocking.id !== unBlockedUserId),
        },
      },
      select: getUserSelectFields(),
    });
    return updatedUnBlockingUser;
  }
  throw ApiError.BadRequest('User not found');
};

const adminBlockUser = async (userId: string) => {
  const userToBeBlocked = await db.user.findUnique({ where: { id: userId } });
  if (!userToBeBlocked) {
    throw ApiError.BadRequest('User not found');
  }
  if (userToBeBlocked.isBlocked) {
    throw ApiError.BadRequest('User already blocked');
  }
  return db.user.update({
    where: { id: userId },
    data: {
      isBlocked: true,
    },
    select: getUserSelectFields(),
  });
};

export { visitUserProfile, changedPasswordAfter, followUser, unFollowUser, blockUser, unBlockUser, adminBlockUser };
