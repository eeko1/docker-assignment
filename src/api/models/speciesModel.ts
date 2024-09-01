import { model, Schema, Model} from 'mongoose';
import { Species } from '../../types/Species';
import { Polygon } from 'geojson';

// Extend the Species interface to include the static method
interface SpeciesModel extends Model<Species> {
  findByArea(polygon: Polygon): Promise<Species[]>;
}

const speciesSchema = new Schema<Species>({
  species_name: { type: String, required: true, unique: true },
  image: { type: String, required: false },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Static method to find species by area
speciesSchema.statics.findByArea = function (polygon: Polygon): Promise<Species[]> {
  return this.find({
    location: {
      $geoWithin: {
        $geometry: polygon
      }
    }
  }).exec();
};

const SpeciesModel = model<Species, SpeciesModel>('Species', speciesSchema);

export default SpeciesModel;
