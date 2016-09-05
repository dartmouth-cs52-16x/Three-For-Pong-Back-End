import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// export const ALLOWED_YEARS = ['16', '17', '18', '19'];
// export const CLASS_YEAR_LENGTH = 2;
// export const EMAIL_ENDING = '@dartmouth.edu';

// user schema
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  full_name: String,
  is_verified: { type: Boolean, default: false },
  verify_token: String,
  phone: { type: Number, unique: true },
  can_host: Boolean,
  default_location: { type: Schema.Types.ObjectId, ref: 'Location' },
  date_joined: { type: Date, default: Date.now },
});

UserSchema.pre('save', function beforeSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      // overwrite plain text password with encrypted password
      user.password = hash;
      return next();
    });
  });
});

//

// note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// create a class for the model
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
