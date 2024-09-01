import {NextFunction, Request, Response} from 'express';
import {Category} from '../../types/Category';
import {MessageResponse} from '../../types/Messages';
import CategoryModel from '../models/categoryModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Category | Category[];
};

const postCategory = async (
  req: Request<{}, {}, Category>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newCategory = new CategoryModel(req.body);
    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: 'Category created',
      data: savedCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getCategories = async (
  req: Request,
  res: Response<Category[]>,
  next: NextFunction,
) => {
  try {
    const categories = await CategoryModel.find();

    res.json(categories);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getCategory = async (
  req: Request<{id: string}>,
  res: Response<Category>,
  next: NextFunction,
) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      throw new CustomError('Category not found', 404);
    }

    res.json(category);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putCategory = async (
  req: Request<{id: string}, {}, Category>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );

    if (!updatedCategory) {
      throw new CustomError('Category not found', 404);
    }

    res.json({
      message: 'Category updated',
      data: updatedCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteCategory = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedCategory) {
      throw new CustomError('Category not found', 404);
    }

    res.json({
      message: 'Category deleted',
      data: deletedCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {postCategory, getCategories, getCategory, putCategory, deleteCategory};
