import {NextFunction, Request, Response} from 'express';
import AnimalModel from '../models/animalModel';
import {Animal} from '../../types/Animal';
import {MessageResponse} from '../../types/Messages';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Animal | Animal[];
};

const postAnimal = async (
  req: Request<{}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newAnimal = new AnimalModel(req.body);
    const savedAnimal = await newAnimal.save();

    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimals = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const species = await AnimalModel.find()
    .populate({
      path: 'species',
      select: '-__v',
      populate: {
        path: 'category',
        select: '-__v',
    }
  }).select('-__v')
  ;

    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    const species = await AnimalModel.findById(req.params.id)
    .populate({
      path: 'species',
      select: '-__v',
      populate: {
        path: 'category',
        select: '-__v',
      },
    })
    .select('-__v');
    if (!species) {
      throw new CustomError('Animal not found', 404);
    }

    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putAnimal = async (
  req: Request<{id: string}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedAnimal = await AnimalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );

    if (!updatedAnimal) {
      throw new CustomError('Animal not found', 404);
    }

    res.json({
      message: 'Animal updated',
      data: updatedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedAnimal = await AnimalModel.findByIdAndDelete(req.params.id);

    if (!deletedAnimal) {
      throw new CustomError('Animal not found', 404);
    }

    res.json({
      message: 'Animal deleted',
      data: deletedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getAnimalsByBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const {topRight, bottomLeft} = req.query;

    const animals = await AnimalModel.find({
      location: {
        $geoWithin: {
          $box: [topRight.split(','), bottomLeft.split(',')],
        },
      },
    })
    .populate({
      path: 'species',
      select: '-__v',
      populate: {
        path: 'category',
        select: '-__v',
      },
    });
    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getBySpecies = async (
  req: Request<{species: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const animals = await AnimalModel.findBySpecies(req.params.species);
    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

export {
  postAnimal,
  getAnimals,
  getAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsByBox,
  getBySpecies,
};
