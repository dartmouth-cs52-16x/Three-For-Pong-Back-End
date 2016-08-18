import User, { EMAIL_ENDING, CLASS_YEAR_LENGTH, ALLOWED_YEARS } from '../models/user_model';
import Location from '../models/location_model';

export const createUser = (req, res) => {
  const email = req.body.email;
  const fullName = req.body.full_name;
  const phone = req.body.phone;
  const canHost = req.body.can_host;
  const defaultLocationId = req.body.default_location_id;

  if (!email || !fullName || !phone) {
    return res.status(422).send('You must provide an email, name, and phone');
  } else if (canHost && !defaultLocationId) {
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

  Location.findOne({ _id: defaultLocationId })
  .exec((error, location) => {
    if (!location || error) {
      console.log(error);
      console.log(location);
      return res.status(422).send('That is not a valid location');
    } else {
      // Now, we know everything is valid
      const user = new User();
      user.email = email;
      user.full_name = fullName;
      user.phone = phone;
      user.can_host = canHost;
      user.default_location_id = defaultLocationId;

      user.save()
      .then(result => {
        res.json({ message: 'User created!' });
      })
      .catch(createError => {
        res.json({ createError });
      });
    }
  });
};

export const updateUser = (req, res) => {
  User.update({ _id: req.params.userID }, {
    email: req.body.email,
    full_name: req.body.full_name,
    phone: req.body.phone,
    can_host: req.body.can_host,
    default_location_id: req.body.default_location_id,
  }, {}, (error, raw) => {
    if (error === null) {
      res.json({ message: 'User updated!' });
    } else {
      res.json({ error });
    }
  });
};

export const getUser = (req, res) => {
  // Limits the response to 1 post
  User.findOne({ _id: req.params.userID }).exec((error, user) => {
    // Retrieve first element in array
    if (user) {
      res.json({
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        can_host: user.can_host,
        defualt_location_id: user.default_location_id,
      });
    } else {
      res.json({ error });
    }
  });
};
