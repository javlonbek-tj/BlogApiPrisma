import 'dotenv/config';
import jwt from 'jsonwebtoken';
import config from 'config';

interface Payload {
  id: string;
  email: string;
}

export const generateTokens = (payload: Payload) => {
  try {
  } catch (e) {
    throw e;
  }
  const accessToken = jwt.sign(payload, config.get<string>('accessTokenKey'), {
    expiresIn: config.get<string>('accessTokenExpiresIn'),
  });
  const refreshToken = jwt.sign(
    payload,
    config.get<string>('refreshTokenKey'),
    {
      expiresIn: config.get<string>('refreshTokenExpiresIn'),
    }
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const validateAccessToken = (token: string) => {
  try {
    const userData = jwt.verify(token, config.get<string>('accessTokenKey'));
    return userData;
  } catch (e) {
    return null;
  }
};

export const refreshAccessToken = (token: string) => {
  try {
    const userData = jwt.verify(token, config.get<string>('refreshTokenKey'));
    return userData;
  } catch (e) {
    return null;
  }
};
