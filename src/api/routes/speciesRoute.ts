import express from 'express';
import {
  deleteSpecies,
  getSingleSpecies,
  getSpecies,
  postSpecies,
  putSpecies,
  getSpeciesByLocation
} from '../controllers/speciesController';
import {addImageToSpecies} from '../../middlewares';

const router = express.Router();

router.post('/area', getSpeciesByLocation);
router.route('/').post(addImageToSpecies, postSpecies).get(getSpecies);

router
  .route('/:id')
  .get(getSingleSpecies)
  .put(putSpecies)
  .delete(deleteSpecies);

export default router;
