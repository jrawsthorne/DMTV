const express = require('express');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const steemConnectAPI = require('../steemConnectAPI');
const Rating = require('../models/Rating');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

router.post('/login', (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) res.status(400).json({ error: 'Not authenticated' });
  steemConnectAPI.setAccessToken(accessToken);
  steemConnectAPI.me().then((steemUser) => {
    User.findOne({ username: steemUser.name }).then((user) => {
      if (user) {
        // create token for user
        const token = jwt.sign({
          id: user.id,
          username: user.username,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // return the steem user and token
        res.json({
          ...steemUser,
          token,
        });
      } else {
        // create a new user
        new User({ username: steemUser.name }).save().then((newUser) => {
          // create token for user
          const token = jwt.sign({
            id: newUser.id,
            username: newUser.username,
          }, process.env.JWT_SECRET, { expiresIn: '7d' });
          // return the steem user and token
          res.json({
            ...steemUser,
            token,
          });
        });
      }
    });
  });
});

router.get('/subscriptions', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user: { subscriptions: subscriptionIds } } = req; // subscription ids from passport user
  // find the user's subscriptions
  Subscription.find({ _id: { $in: subscriptionIds } }, '-_id type tmdbid').then((subscriptions) => {
    // return the subscriptions
    res.json(subscriptions);
  });
});

router.get('/ratings', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user: { ratings: ratingIds } } = req; // rating ids from passport user
  // find the user's ratings
  Rating.find({ _id: { $in: ratingIds } }, '-_id mediaType tmdbid seasonNum episodeNum score').then((ratings) => {
    // return the ratings
    res.json(ratings);
  });
});

module.exports = router;
