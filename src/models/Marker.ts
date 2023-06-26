import mongoose, { Document, Model, model, Schema } from 'mongoose';

export interface IMarker extends Document {
  markerName: string;
  categoryId: number;
  markerTypeId: number;
  description?: string;
  coordinate?: number[];
  path?: number[][];
  parentId?: string;
  mapSlug: string;
  gameSlug: string;
  lat?: number;
  zoomRange?: number[];
}

const MarkerSchema: Schema = new Schema({
  markerName: {
    type: String,
    require: true,
  },
  categoryId: {
    type: Number,
    require: true,
  },
  mapSlug: {
    type: String,
    require: true,
  },
  gameSlug: {
    type: String,
    require: true,
  },
  coordinate: {
    type: [],
  },
  path: {
    type: [[]],
  },
  lat: {
    type: Number,
  },
  zoomRange: {
    type: [],
  },
});

export const Marker = (mongoose.models.Marker ||
  model('Marker', MarkerSchema)) as Model<IMarker>;
