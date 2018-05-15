const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const steemConnectAPI = require('../steemConnectAPI');
const jwt = require('jsonwebtoken');

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

module.exports = router;
