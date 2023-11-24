import { z } from 'zod';

export enum RoleEnumType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

export enum AwardEnumType {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
}

export const createUserSchema = z.object({
  body: z
    .object({
      firstname: z
        .string({
          required_error: 'Firstname is required',
          invalid_type_error: 'Firstname must be a string',
        })
        .trim(),
      lastname: z
        .string({
          required_error: 'Lastname is required',
          invalid_type_error: 'Lastname must be a string',
        })
        .trim(),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email({ message: 'Invalid email' }),
      profilPhoto: z.string().optional(),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(8, { message: 'Password must be more than 8 characters' }),
      passwordConfirm: z.string({
        required_error: 'passwordConfirm is required',
      }),
      role: z.nativeEnum(RoleEnumType).default(RoleEnumType.USER),
    })
    .refine(data => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: 'Passwords do not match',
    }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email' }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

export type CreateUserInput = Omit<z.infer<typeof createUserSchema>['body'], 'passwordConfirm'>;

export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
