import mongoose, { Schema } from 'mongoose';

// location schema
const LocationSchema = new Schema({
  location_name: String,
});

// create a class for the model
const LocationModel = mongoose.model('Location', LocationSchema);

export default LocationModel;
