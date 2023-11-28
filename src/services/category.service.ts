import { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';
import ApiError from '../utils/appError';
import db from '../utils/db';

const create = async ({ title }: CreateCategoryInput) => {
  const CategoryExists = await db.category.findUnique({ where: { title } });
  if (CategoryExists) {
    throw ApiError.BadRequest('Category already exists');
  }
  const category = await db.category.create({
    data: {
      title,
    },
  });
  return category;
};

const allCategories = async () => {
  const categories = await db.category.findMany();
  return categories;
};

const oneCategory = async (id: string) => {
  const category = await db.category.findUnique({ where: { id } });
  if (!category) {
    throw ApiError.BadRequest('Category not Found');
  }
  return category;
};

const updateCategory = async (id: string, { title }: UpdateCategoryInput) => {
  const category = await db.category.findUnique({ where: { id } });
  if (!category) {
    throw ApiError.BadRequest('Category not Found');
  }
  return db.category.update({
    where: { id },
    data: {
      title,
    },
  });
};

const deleteCategory = async (id: string) => {
  const category = await db.category.findUnique({ where: { id } });
  if (!category) {
    throw ApiError.BadRequest('Category not Found');
  }
  return db.category.delete({ where: { id } });
};

export { create, allCategories, oneCategory, updateCategory, deleteCategory };
