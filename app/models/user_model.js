import mongoose, { Schema } from 'mongoose';

export const ALLOWED_YEARS = ['16', '17', '18', '19'];
export const CLASS_YEAR_LENGTH = 2;
export const EMAIL_ENDING = '@dartmouth.edu';

// user schema
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  full_name: String,
  phone: Number,
  can_host: Boolean,
  default_location_id: { type: Schema.Types.ObjectId, ref: 'Location' },
  date_joined: { type: Date, default: Date.now },
});

// create a class for the model
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
