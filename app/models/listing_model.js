import mongoose, { Schema } from 'mongoose';

// listing schema
const ListingSchema = new Schema({
  location_id: String,
  host_user_id: String,
  users: [Schema.Types.Mixed],                      // JSON, in the form: [{user_id=123,is_confirmed=0},{user_id=456,is_confirmed=0}]
  start_time: { type: Date },                       // UTC time when the game will start
  posted_time: { type: Date, default: Date.now },   // UTC time when the listing was posted
});

// create a class for the model
const ListingModel = mongoose.model('Listing', ListingSchema);

export default ListingModel;
