import { CreatePostInput, UpdatePostInput } from '../schemas/post.schema';
import ApiError from '../utils/appError';
import db from '../utils/db';

const create = async (authorId: string, { title, description, photo, categories }: CreatePostInput) => {
  const post = await db.post.create({
    data: {
      title,
      description,
      photo,
      authorId,
      category: {
        connect: categories.map(category => ({ id: category })),
      },
    },
  });
  return post;
};

const allPosts = async () => {
  const posts = await db.post.findMany();
  return posts;
};

const onePost = async (id: string) => {
  const post = await db.post.findUnique({ where: { id } });
  if (!post) {
    throw ApiError.BadRequest('Post not Found');
  }
  return post;
};

const updatePost = async (id: string, input: UpdatePostInput) => {
  const post = await db.post.findUnique({ where: { id } });
  if (!post) {
    throw ApiError.BadRequest('Post not Found');
  }
  const dataToUpdate: UpdatePostInput = {};

  if (input.title !== undefined) {
    dataToUpdate.title = input.title;
  }

  if (input.description !== undefined) {
    dataToUpdate.description = input.description;
  }

  if (input.photo !== undefined) {
    dataToUpdate.photo = input.photo;
  }

  if (input.categories !== undefined) {
    dataToUpdate.categories = input.categories;
  }
  return db.post.update({
    where: { id },
    data: dataToUpdate,
  });
};

const deletepost = async (id: string) => {
  const post = await db.post.findUnique({ where: { id } });
  if (!post) {
    throw ApiError.BadRequest('Post not Found');
  }
  return db.post.delete({ where: { id } });
};

export { create, allPosts, onePost, updatePost, deletepost };
