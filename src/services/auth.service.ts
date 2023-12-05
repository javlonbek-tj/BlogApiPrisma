import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import 'dotenv/config';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import ApiError from '../utils/appError';
import db from '../utils/db';
import { sendActivationCode, sendMail } from './mail.service';
import * as tokenService from './token.service';
import { getUserSelectFields } from '../utils/getSelectedField';

const signup = async ({ firstname, lastname, email, password, role }: CreateUserInput) => {
  const isUserExists = await db.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    throw ApiError.BadRequest(`${email} is already taken`);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;
  const numberAsString = randomSixDigitNumber.toString();
  const hashedActivationCode = await bcrypt.hash(numberAsString, 10);
  const activationCodeExpires: number = Date.now() + 1 * 60 * 1000;
  await db.user.create({
    data: {
      firstname,
      lastname,
      email,
      activationCode: hashedActivationCode,
      activationCodeExpires: 4646876464313,
      password: hashedPassword,
      role,
    },
  });
  try {
    sendActivationCode(email, randomSixDigitNumber);
  } catch (e) {
    await db.user.delete({ where: { email } });
    throw new ApiError(500, 'There was an error sending the email. Try again later!');
  }
};

const reSendActivationCode = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw ApiError.BadRequest('User not found');
  }

  const randomSixDigitNumber = Math.floor(Math.random() * 900000) + 100000;
  const numberAsString = randomSixDigitNumber.toString();
  const hashedActivationCode = await bcrypt.hash(numberAsString, 10);
  const activationCodeExpires: number = Date.now() + 1 * 60 * 1000;

  await db.user.update({
    where: { id: user.id },
    data: {
      activationCode: hashedActivationCode,
      activationCodeExpires,
    },
  });

  try {
    sendActivationCode(email, randomSixDigitNumber);
  } catch (e) {
    throw new ApiError(500, 'There was an error sending the email. Try again later!');
  }
};

const activate = async (activationCode: string) => {
  const hashedActivationCode = await bcrypt.hash(activationCode, 10);
  const user = await db.user.findFirst({
    where: {
      activationCode: hashedActivationCode,
      activationCodeExpires: {
        gt: Date.now(),
      },
    },
  });
  if (!user) {
    throw ApiError.BadRequest('Incorrect Code');
  }
  await db.user.update({
    where: { id: user.id },
    data: {
      isActivated: true,
    },
  });
  const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
  await tokenService.saveToken(user.id, tokens.refreshToken);
  return tokens;
};

const signin = async (input: LoginUserInput) => {
  const existingUser = await db.user.findUnique({
    where: { email: input.email },
    select: getUserSelectFields(true),
  });
  if (!existingUser) {
    throw ApiError.BadRequest('Email or password incorrect');
  }
  const isPassCorrect = await bcrypt.compare(input.password, existingUser.password);
  if (!isPassCorrect) {
    throw ApiError.BadRequest('Email or password incorrect');
  }
  const tokens = tokenService.generateTokens({ id: existingUser.id, email: existingUser.email });
  await tokenService.saveToken(existingUser.id, tokens.refreshToken);
  const { password, ...user } = existingUser;
  return { ...tokens, user };
};

const signout = (refreshToken: string) => {
  return tokenService.removeToken(refreshToken);
};

export { signup, reSendActivationCode, activate, signin, signout };
