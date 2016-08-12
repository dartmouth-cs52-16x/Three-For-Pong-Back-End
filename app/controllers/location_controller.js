import Location from '../models/location_model';

export const createLocation = (req, res) => {
  const location = new Location();
  location.location_name = req.body.location_name;
  location.save()
  .then(result => {
    res.json({ message: 'Location created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getLocations = (req, res) => {
  Location.find().sort('-location_name').exec((error, locations) => {
    res.json(locations.map(location => {
      return { location_id: location._id, location_name: location.location_name };
    }));
  });
};
