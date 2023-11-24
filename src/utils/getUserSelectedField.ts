type UserSelect = {
  id: boolean;
  firstname: boolean;
  lastname: boolean;
  profilPhoto: boolean;
  email: boolean;
  isBlocked: boolean;
  role: boolean;
  userAward: boolean;
  isActivated: boolean;
  viewers?: { select: { id: boolean } } | boolean;
  followers?: { select: { id: boolean } } | boolean;
  followings?: { select: { id: boolean } } | boolean;
  posts?: { select: { id: boolean } } | boolean;
  comments?: { select: { id: boolean } } | boolean;
  password?: boolean; // Include password only when needed
  createdAt: boolean;
  updatedAt: boolean;
};

export const getUserSelectFields = (includePassword = false): UserSelect => ({
  id: true,
  firstname: true,
  lastname: true,
  profilPhoto: true,
  email: true,
  isBlocked: true,
  role: true,
  userAward: true,
  isActivated: true,
  viewers: { select: { id: true } },
  followers: { select: { id: true } },
  followings: { select: { id: true } },
  posts: { select: { id: true } },
  comments: { select: { id: true } },
  password: includePassword,
  createdAt: true,
  updatedAt: true,
});
