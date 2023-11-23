import 'dotenv/config';
import jwt from 'jsonwebtoken';
import config from 'config';
import db from '../utils/db';

interface Payload {
  id: string;
  email: string;
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  password?: string;
}

const generateTokens = (payload: Payload) => {
  const accessToken = jwt.sign(payload, config.get<string>('accessTokenKey'), {
    expiresIn: config.get<string>('accessTokenExpiresIn'),
  });
  const refreshToken = jwt.sign(payload, config.get<string>('refreshTokenKey'), {
    expiresIn: config.get<string>('refreshTokenExpiresIn'),
  });
  return {
    accessToken,
    refreshToken,
  };
};

const validateAccessToken = (token: string) => {
  const userData = jwt.verify(token, config.get<string>('accessTokenKey'));
  return userData;
};

const validateRefreshToken = (token: string) => {
  const userData = jwt.verify(token, config.get<string>('refreshTokenKey'));
  return userData;
};

const saveToken = async (userId: string, refreshToken: string) => {
  const tokenData = await db.token.findUnique({ where: { userId } });
  if (tokenData) {
    const updatedTokenData = await db.token.update({
      where: { userId },
      data: {
        refreshToken,
      },
    });

    return updatedTokenData;
  }
  const token = await db.token.create({
    data: {
      userId,
      refreshToken,
    },
  });
  return token;
};

const findToken = async (refreshToken: string) => {
  const tokenData = await db.token.findFirst({ where: { refreshToken } });
  return tokenData;
};

const removeToken = async (refreshToken: string) => {
  const tokenData = await db.token.findFirst({ where: { refreshToken } });
  if (tokenData) {
    await db.token.delete({ where: { id: tokenData.id } });
  }
  return tokenData;
};

const createAndSaveTokens = async (userData: User) => {
  const payload = { id: userData.id, email: userData.email };
  const tokens = generateTokens(payload);
  await saveToken(userData.id, tokens.refreshToken);
  const { password, ...user } = userData;
  return { ...tokens, user };
};

export { generateTokens, validateAccessToken, validateRefreshToken, saveToken, findToken, removeToken, createAndSaveTokens };
