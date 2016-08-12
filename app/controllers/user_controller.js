import User from '../models/user_model';

export const createUser = (req, res) => {
  const user = new User();
  user.full_name = req.body.name;
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
  User.update({ _id: req.params.id }, {
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
