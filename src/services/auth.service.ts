import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import 'dotenv/config';
import config from 'config';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import ApiError from '../utils/appError';
import db from '../utils/db';
import { sendMail } from './mail.service';
import * as tokenService from './token.service';

const signup = async ({ firstname, lastname, email, password, role }: CreateUserInput) => {
  const isUserExists = await db.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    throw ApiError.BadRequest(`${email} is already taken`);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const activationLink = v4();
  const user = await db.user.create({
    data: {
      firstname,
      lastname,
      email,
      activationLink,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
    },
  });
  /* try {
    const subject = 'Your activation Link';
    const link = `${config.get<string>('apiUrl')}/v1/users/activate/${activationLink}`;
    const html = `<div>
            <h1>For activation hit this link</h1>
            <a href="${link}">${link}</a>
            </div>`;
    sendMail(email, subject, html);
  } catch (e) {
    await db.user.delete({ where: { email } });
    throw new ApiError(500, 'There was an error sending the email. Try again later!');
  } */
  return tokenService.createAndSaveTokens(user);
};

const activate = async (activationLink: string) => {
  const user = await db.user.findFirst({ where: { activationLink } });
  if (!user) {
    throw ApiError.BadRequest('Incorrect activationLink');
  }
  await db.user.update({
    where: { id: user.id },
    data: {
      isActivated: true,
    },
  });
};

const signin = async ({ email, password }: LoginUserInput) => {
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      password: true,
    },
  });
  if (!user) {
    throw ApiError.BadRequest('Email or password incorrect');
  }
  const isPassCorrect = await bcrypt.compare(password, user.password);
  if (!isPassCorrect) {
    throw ApiError.BadRequest('Email or password incorrect');
  }
  return tokenService.createAndSaveTokens(user);
};

const signout = (refreshToken: string) => {
  return tokenService.removeToken(refreshToken);
};

export { signup, activate, signin, signout };
