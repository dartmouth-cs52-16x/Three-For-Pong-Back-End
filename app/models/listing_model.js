import mongoose, { Schema } from 'mongoose';

// listing schema
const ListingSchema = new Schema({
  location_id: String,
  host_user_id: String,
  users: [String],                                  // All the users (by user_id) playing
  num_looking_for_game: Number,
  start_time: { type: Date },                       // UTC time when the game will start
  posted_time: { type: Date, default: Date.now },   // UTC time when the listing was posted
});

// create a class for the model
const ListingModel = mongoose.model('Listing', ListingSchema);

export default ListingModel;
