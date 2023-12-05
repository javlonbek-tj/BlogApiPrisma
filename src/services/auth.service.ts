import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import 'dotenv/config';
import config from 'config';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import ApiError from '../utils/appError';
import db from '../utils/db';
import { sendMail } from './mail.service';
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
    select: getUserSelectFields(),
  });
  try {
    const subject = 'Your activation Link';
    const link = `${config.get<string>('apiUrl')}/users/activate/${activationLink}`;
    const html = `<div>
            <h1>For activation hit this link</h1>
            <a href="${link}">${link}</a>
            </div>`;
    sendMail(email, subject, html);
  } catch (e) {
    await db.user.delete({ where: { email } });
    throw new ApiError(500, 'There was an error sending the email. Try again later!');
  }
  const tokens = tokenService.generateTokens({ id: user.id, email: user.email });
  await tokenService.saveToken(user.id, tokens.refreshToken);
  return { ...tokens, user };
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

export { signup, activate, signin, signout };
