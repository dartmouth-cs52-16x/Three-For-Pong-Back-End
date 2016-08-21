import { Router } from 'express';
import * as Users from './controllers/user_controller';
import * as Locations from './controllers/location_controller';
import * as Listings from './controllers/listing_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

// routes go here

router.post('/signin', requireSignin, Users.loginUser);
router.post('/signup', Users.createUser);
router.post('/verify/:userID', Users.verifyUser);

router.route('/users/:userID')
  .put(requireAuth, Users.updateUser)
  .get(requireAuth, Users.getUser);

router.route('/locations')
  .post(requireAuth, Locations.createLocation)  // TODO remove this
  .get(Locations.getLocations);

router.route('/listings')
  .post(requireAuth, Listings.createListing)
  .get(requireAuth, Listings.getListings);

router.route('/listings/:listingID')
  .put(requireAuth, Listings.updateListing)
  .delete(requireAuth, Listings.removeListing);

router.route('/listings/join/:listingID')
  .post(requireAuth, Listings.joinListing); // TODO

router.route('/listings/leave/:listingID')
  .post(requireAuth, Listings.leaveListing); // TODO

export default router;
