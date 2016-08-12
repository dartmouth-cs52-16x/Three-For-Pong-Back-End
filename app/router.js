import { Router } from 'express';
import * as Users from './controllers/user_controller';
import * as Locations from './controllers/location_controller';
import * as Listings from './controllers/listing_controller';

const router = Router();

// routes go here

router.route('/users')
  .post(Users.createUser);

router.route('/users/:userID')
  .put(Users.updateUser)
  .get(Users.getUser);

router.route('/locations')
  .post(Locations.createLocation)
  .get(Locations.getLocations);

router.route('/listings')
  .post(Listings.createListing)
  .get(Listings.getListings); // TODO

router.route('/listings/:listingID')
  .put(Listings.updateListing) // TODO
  .delete(Listings.deleteListing); // TODO

router.route('/listings/join/:listingID')
  .post(Listings.joinListing); // TODO

router.route('/listings/leave/:listingID')
  .post(Listings.leaveListing); // TODO

export default router;
