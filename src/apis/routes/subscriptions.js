const express = require('express');
const Post = require('../models/Post');
const Subscription = require('../models/Subscription');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user: { subscriptions: subscriptionIds } } = req; // subscription ids from passport user
  // find the user's subscriptions
  Subscription.find({ _id: { $in: subscriptionIds } }).then((subscriptions) => {
    if (subscriptions.length > 0) {
      // query of all posts matching a subscription if a user has subscriptions
      const query = {
        $or: subscriptions.map(subscription => ({
          type: subscription.type,
          tmdbid: subscription.tmdbid,
        })),
      };
      // find the total number of posts and return the newest 20
      Promise.all([
        Post.count(query),
        Post.find(query).sort({ createdAt: -1 }).limit(20),
      ]).then((data) => {
        // return the total count and an array of posts
        res.json({
          count: data[0],
          results: data[1],
        });
      });
    } else {
      // return an empty array of posts if a user has no subscriptions
      res.json({
        count: 0,
        results: [],
      });
    }
  });
});

router.post('/change', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { type, tmdbid, subscribed } = req.body;
  const { user } = req; // user from passport

  // find the subscription
  Subscription.findOne({ user, type, tmdbid }).then((subscription) => {
    if (subscription) {
      if (JSON.parse(subscribed) === false) {
        // remove subscription if subscribed is false
        subscription.remove().then(() => {
          // remove the subscription id from the user
          user.update({ $pull: { subscriptions: subscription.id } }).then(() => {
            // return an empty object
            res.json({});
          });
        });
      } else {
        // return the subscription if already subscribed
        res.json(subscription);
      }
    } else if (JSON.parse(subscribed) === false) {
      // return error if subscription not found
      res.status(404).json({ error: 'Subscription not found' });
    } else {
      // create a new subscription
      new Subscription({ user, type, tmdbid }).save().then((newSubscription) => {
        // add the subscription id to the user
        user.update({ $push: { subscriptions: { _id: newSubscription.id } } }).then(() => {
          // return the subscriptions id, tmdbid and type
          res.json({
            _id: newSubscription.id,
            tmdbid: newSubscription.tmdbid,
            type: newSubscription.type,
          });
        });
      });
    }
  });
});

module.exports = router;
