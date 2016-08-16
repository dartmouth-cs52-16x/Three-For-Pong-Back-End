import User from '../models/user_model';

export const createUser = (req, res) => {
  const user = new User();
  user.full_name = req.body.full_name;
  user.phone = req.body.phone;
  user.can_host = req.body.can_host;
  user.default_location_id = req.body.default_location_id;
  user.save()
  .then(result => {
    res.json({ message: 'User created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const updateUser = (req, res) => {
  User.update({ _id: req.params.userID }, {
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
