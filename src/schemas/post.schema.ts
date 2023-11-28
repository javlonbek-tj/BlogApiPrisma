import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'title is required',
        invalid_type_error: 'title must be a string',
      })
      .trim(),
    description: z
      .string({
        required_error: 'description is required',
        invalid_type_error: 'description must be a string',
      })
      .trim(),
    photo: z.string({
      required_error: 'photo is required',
      invalid_type_error: 'photo must be a string',
    }),
    categories: z.array(z.string()),
  }),
});

const params = {
  params: z.object({
    postId: z.string(),
  }),
};

export const getPostSchema = z.object({
  ...params,
});

export const updatePostSchema = z.object({
  ...params,
  body: z.object({
    title: z
      .string({
        invalid_type_error: 'title must be a string',
      })
      .trim()
      .optional(),
    description: z
      .string({
        invalid_type_error: 'description must be a string',
      })
      .trim()
      .optional(),
    photo: z
      .string({
        invalid_type_error: 'photo must be a string',
      })
      .optional(),
    categories: z.array(z.string()).optional(),
  }),
});

export const deletePostSchema = z.object({
  ...params,
});

export type CreatePostInput = z.infer<typeof createPostSchema>['body'];

export type GetPostInput = z.infer<typeof getPostSchema>['params'];

export type UpdatePostInput = z.infer<typeof updatePostSchema>['body'];

export type DeletePostInput = z.infer<typeof deletePostSchema>['params'];
