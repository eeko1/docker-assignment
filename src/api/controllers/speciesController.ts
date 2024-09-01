import {NextFunction, Request, Response} from 'express';
import SpeciesModel from '../models/speciesModel';
import {Species} from '../../types/Species';
import {MessageResponse} from '../../types/Messages';
import CustomError from '../../classes/CustomError';
import { Polygon } from 'geojson';

type DBMessageResponse = MessageResponse & {
  data: Species | Species[];
};

const postSpecies = async (
  req: Request<{}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const newSpecies = new SpeciesModel(req.body);
    const savedSpecies = await newSpecies.save();

    res.status(201).json({
      message: 'Species created',
      data: savedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSpecies = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction,
) => {
  try {
    const species = await SpeciesModel.find();

    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSingleSpecies = async (
  req: Request<{id: string}>,
  res: Response<Species>,
  next: NextFunction,
) => {
  try {
    const species = await SpeciesModel.findById(req.params.id);

    if (!species) {
      throw new CustomError('Species not found', 404);
    }

    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const putSpecies = async (
  req: Request<{id: string}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const updatedSpecies = await SpeciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
    );

    if (!updatedSpecies) {
      throw new CustomError('Species not found', 404);
    }

    res.json({
      message: 'Species updated',
      data: updatedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteSpecies = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deletedSpecies = await SpeciesModel.findByIdAndDelete(req.params.id);

    if (!deletedSpecies) {
      throw new CustomError('Species not found', 404);
    }

    res.json({
      message: 'Species deleted',
      data: deletedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// Add a static method to 'Species' model to find all species within a certain area specified by a geoJson polygon: findByArea(polygon: Polygon): Promise<Species[]>
// The endpoint should be POST /species/area and the body should contain the geoJson polygon in the following forma
const getSpeciesByLocation = async (req: Request<{}, {}, {polygon: Polygon}>, res: Response<Species[]>, next: NextFunction) => {
  try {
    const { polygon } = req.body;
    const species = await SpeciesModel.findByArea(polygon);

    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};



export {postSpecies, getSpecies, getSingleSpecies, putSpecies, deleteSpecies, getSpeciesByLocation};
