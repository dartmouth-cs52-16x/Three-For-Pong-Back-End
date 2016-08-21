import User, { EMAIL_ENDING, CLASS_YEAR_LENGTH, ALLOWED_YEARS } from '../models/user_model';
import Location from '../models/location_model';
// import dotenv from 'dotenv';
import jwt from 'jwt-simple';
import * as sendgrid from '../services/sendgrid';
// dotenv.config({ silent: true });


// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, process.env.API_SECRET);
}

function tokenForUserId(userId) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userId, iat: timestamp }, process.env.API_SECRET);
}

export const createUser = (req, res) => {
  const email = req.body.email;
  const fullName = req.body.full_name;
  const phone = req.body.phone;
  const canHost = req.body.can_host;
  const password = req.body.password;
  const defaultLocation = req.body.default_location_id;
  const verifyToken = Math.floor((Math.random() * 89999) + 10000);

  if (!email || !fullName || !phone || !password) {
    return res.status(422).send('You must provide an email, name, phone, and password');
  } else if (canHost && !defaultLocation) {
    return res.status(422).send('You must provide a default location if you can host');
  } else if (email.substr(email.length - EMAIL_ENDING.length) !== EMAIL_ENDING) {
    return res.status(422).send('Only Dartmouth students may signup');
  } else if (canHost !== true && canHost !== false) {
    return res.status(422).send('Ability to host must be true or false');
  } else if (phone.match(/\d/g).length !== 10) {      // http://stackoverflow.com/questions/4338267/validate-phone-number-with-javascript
    return res.status(422).send('Your phone number must be ten digits with no hyphens or parentheses');
  } else {
    // Verify class year
    let classYear = 0;
    const emailClassYear = email.substr(email.length - EMAIL_ENDING.length - CLASS_YEAR_LENGTH, CLASS_YEAR_LENGTH);
    ALLOWED_YEARS.forEach((allowedClassYear) => {
      if (emailClassYear === allowedClassYear) {
        classYear = parseInt(emailClassYear, 10);
      }
    });
    if (classYear === 0) {
      return res.status(422).send('Your class year is not allowed yet');
    }
  }

  Location.findOne({ _id: defaultLocation })
  .exec((error, location) => {
    if (!location || error) {
      console.log(error);
      console.log(location);
      return res.status(422).send('That is not a valid location');
    } else {
      User.findOne({ email }, (findEmailError, existingEmail) => {
        if (!existingEmail) {
          User.findOne({ phone }, (findPhoneError, existingPhone) => {
            if (!existingPhone) {
              // Now, we know everything is valid
              const user = new User();
              user.email = email;
              user.full_name = fullName;
              user.phone = phone;
              user.can_host = canHost;
              user.default_location = defaultLocation;
              user.password = password;
              user.verify_token = verifyToken;
              user.save()
              .then(result => {
                sendgrid.sendEmail(user.email, user.full_name, user.verify_token);
                res.send({ user_id: user._id });
              })
              .catch(createError => {
                res.json({ createError });
              });
            } else {
              res.status(422).send('That phone number is already registered');
            }
          });
        } else {
          res.status(422).send('That email is already registered');
        }
      });
    }
  });
};

/*
 TODO fix this to check arguments, as in create
*/
export const updateUser = (req, res) => {
  User.update({ _id: req.params.userID }, {
    email: req.body.email,
    full_name: req.body.full_name,
    phone: req.body.phone,
    can_host: req.body.can_host,
    default_location: req.body.default_location_id,
  }, {}, (error, raw) => {
    if (error === null) {
      res.json({ message: 'User updated!' });
    } else {
      res.json({ error });
    }
  });
};

export const verifyUser = (req, res) => {
  User.update({ _id: req.params.userID, verify_token: req.body.verify_token }, {
    is_verified: true,
  }, {}, (error, raw) => {
    if (error === null && raw.ok) {
      res.send({ user_id: req.params.userID, token: tokenForUserId(req.params.userID) });
    } else {
      res.status(422).send('Invalid token');
    }
  });
};

export const getUser = (req, res) => {
  // Limits the response to 1 post
  User.findOne({ _id: req.params.userID })
  .populate('default_location')
  .exec((error, user) => {
    // Retrieve first element in array
    if (user) {
      res.json({
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        can_host: user.can_host,
        default_location: user.default_location,
      });
    } else {
      res.json({ error });
    }
  });
};

export const loginUser = (req, res, next) => {
  res.send({ user_id: req.user._id, token: tokenForUser(req.user) });
};
