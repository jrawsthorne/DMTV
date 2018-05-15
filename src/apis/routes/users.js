const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Subscription = require('../models/Subscription');
const steemConnectAPI = require('../steemConnectAPI');
const jwt = require('jsonwebtoken');
const flatten = require('lodash/flatten');
const orderBy = require('lodash/orderBy');
const passport = require('passport');

const router = express.Router();

router.post('/login', (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) res.status(400).json({ error: 'Not authenticated' });
  steemConnectAPI.setAccessToken(accessToken);
  steemConnectAPI.me()
    .then((steemUser) => {
      User.findOne({ username: steemUser.name }).populate({ path: 'ratings', select: 'score mediaType tmdbid seasonNum episodeNum' })
        .then((user) => {
          if (user) {
            const token = jwt.sign({
              id: user.id,
              username: user.username,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({
              user: {
                ...steemUser,
                account: {
                  ...steemUser.account,
                  ratings: {
                    scores: user.ratings,
                  },
                },
              },
              token,
            });
          } else {
            new User({ username: steemUser.name }).save().then((newUser) => {
              const token = jwt.sign({
                id: newUser.id,
                username: newUser.username,
              }, process.env.JWT_SECRET, { expiresIn: '1h' });
              res.json({
                user: steemUser,
                token,
              });
            });
          }
        });
    })
    .catch(() => res.status(400).json({ error: 'Not authenticated' }));
});

router.get('/subscriptions', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user } = req;
  let count = 0;
  Subscription.find({ user })
    .then((subscriptions) => {
      Promise.all(subscriptions.map(subscription =>
        Post.count({ type: subscription.type, tmdbid: subscription.tmdbid }).then(c =>
          Post.find({ type: subscription.type, tmdbid: subscription.tmdbid })
            .then((posts) => { count += c; return posts; }))))
        .then(posts => res.json({
          count,
          results: orderBy(flatten(posts), 'createdAt', 'desc'),
        }));
    })
    .catch(() => res.status(404).json({ error: 'Error fetching subscriptions' }));
});

router.post('/subscriptions/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { type, tmdbid } = req.body;
  const { user } = req;
  const subscription = new Subscription({
    user,
    type,
    tmdbid,
  });
  subscription.save().then((newSubscription) => {
    user.subscriptions.push(newSubscription);
    user.save().then(() => res.json(newSubscription));
  });
});

module.exports = router;
