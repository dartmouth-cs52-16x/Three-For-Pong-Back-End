import Listing from '../models/listing_model';

const GAME_SIZE = 4;

const removeOldListings = () => {

};

export const createListing = (req, res) => {
  const listing = new Listing();
  listing.location = req.body.location_id;
  listing.host_user = req.body.host_user_id;
  listing.users = [];
  listing.num_looking_for_game = req.body.num_looking_for_game;
  listing.num_still_needed_for_game = GAME_SIZE - listing.num_looking_for_game;
  listing.start_time = Date.parse(req.body.start_time);
  listing.save()
  .then(result => {
    res.json({ message: 'Listing created!' });
  })
  .catch(error => {
    res.json({ error });
  });
};

export const getListings = (req, res) => {
  const now = Date.now();
  Listing.find({ num_still_needed_for_game: { $gt: 0 }, start_time: { $gt: now } })
  .sort('start_time')
  .populate('location host_user users')
  .exec((error, listings) => {
    res.json(listings.map(listing => {
      return {
        listing_id: listing._id,
        location: listing.location,
        host_user: listing.host_user,
        users: listing.users,
        num_still_needed_for_game: listing.num_still_needed_for_game,
        start_time: listing.start_time,
      };
    }));
  });
};

// TODO ensure that we actually get "num_still_needed_for_game"
export const updateListing = (req, res) => {
  Listing.update({ _id: req.params.listingID }, {
    location: req.body.location_id,
    host_user: req.body.host_user_id,
    num_looking_for_game: req.body.num_looking_for_game,
    num_still_needed_for_game: req.body.num_still_needed_for_game,
    start_time: req.body.start_time,
  }, {}, (error, raw) => {
    if (error === null) {
      res.json({ message: 'Listing updated!' });
    } else {
      res.json({ error });
    }
  });
};

export const removeListing = (req, res) => {
  Listing.remove({ _id: req.params.listingID }, (error, listings) => {
    if (error === null) {
      res.json({ message: 'Listing removed!' });
    } else {
      res.json({ error });
    }
  });
};

export const joinListing = (req, res) => {
  // First, retrieve the Users[] array for the listing
  Listing.find({ _id: req.params.listingID })
  .limit(1)
  .populate('users')
  .exec((findError, listings) => {
    // Retrieve first element in array
    const listing = listings[0];
    // Check if they are already in the game
    let foundMatch = false;
    listing.users.forEach((user) => {
      if (user._id.toString() === req.body.user_id) {
        foundMatch = true;
      }
    });

    if (foundMatch) {
      return res.json({ message: 'You already joined this game' });
    }
    // Add the new user to the array and update it back in the database
    listing.users.push(req.body.user_id);
    listing.num_still_needed_for_game--;
    Listing.update({ _id: req.params.listingID }, {
      users: listing.users,
      num_still_needed_for_game: listing.num_still_needed_for_game,
    }, {}, (updateError, raw) => {
      if (updateError === null) {
        // TODO add SMS here
        res.json({ message: 'A user joined this listing!' });
      } else {
        res.json({ updateError });
      }
    });
  });
};

export const leaveListing = (req, res) => {
  // First, retrieve the Users[] array for the listing
  Listing.find({ _id: req.params.listingID })
  .populate('users')
  .limit(1)
  .exec((findError, listings) => {
    // Retrieve first element in array
    const listing = listings[0];
    const newUsersArray = [];
    // Remove the user from the array and update it back in the database
    let foundMatch = false;
    console.log('Iterating through the users for the leave function');
    listing.users.forEach((user) => {
      const userId = user._id;
      console.log(`Should I add ${userId}`);
      if (userId.toString() !== req.body.user_id) {
        console.log(`Adding since no match to ${req.body.user_id}`);
        newUsersArray.push(userId);
      } else {
        console.log(`Didn't add ${userId} since it is equal to ${req.body.user_id}`);
        foundMatch = true;
      }
    });

    if (foundMatch === true) {
      Listing.update({ _id: req.params.listingID }, {
        users: newUsersArray,
        num_still_needed_for_game: listing.num_still_needed_for_game + 1,
      }, {}, (updateError, raw) => {
        if (updateError === null) {
          res.json({ message: 'A user left this listing!' });
        } else {
          res.json({ updateError });
        }
      });
    } else {
      res.json({ message: 'You are not a part of this game!' });
    }
  });
};
