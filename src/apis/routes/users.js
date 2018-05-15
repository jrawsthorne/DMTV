const express = require('express');
const User = require('../models/User');
const steemConnectAPI = require('../steemConnectAPI');

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
            res.json({
              ...steemUser,
              account: {
                ...steemUser.account,
                ratings: {
                  scores: user.ratings,
                },
              },
            });
          } else {
            new User({ username: steemUser.name }).save().then(() => res.json(steemUser));
          }
        });
    })
    .catch(() => res.status(400).json({ error: 'Not authenticated' }));
});

module.exports = router;
