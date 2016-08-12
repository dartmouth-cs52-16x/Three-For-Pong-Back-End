import mongoose, { Schema } from 'mongoose';

// users schema
const UserSchema = new Schema({
  full_name: String,
  phone: String,
  can_host: Boolean,
  default_location_id: String,
  date_joined: { type: Date, default: Date.now },
});

// create a class for the model
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
