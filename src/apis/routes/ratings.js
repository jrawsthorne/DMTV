const express = require('express');
const Rating = require('../models/Rating');
const User = require('../models/User');
const steemConnectAPI = require('../steemConnectAPI');

const router = express.Router();

router.get('/', (req, res) => {
  const {
    mediaType, tmdbid, seasonNum, episodeNum,
  } = req.query;
  if (episodeNum && !seasonNum) {
    return res.status(404).json('Ratings not found, please specify a season number as well');
  }
  return Rating.find({
    mediaType, tmdbid, seasonNum, episodeNum,
  }).populate('user', 'username')
    .then(ratings => res.json(ratings));
});

router.post('/add', (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) res.status(400).json({ error: 'Not authenticated' });
  steemConnectAPI.setAccessToken(accessToken);
  const {
    mediaType, tmdbid, seasonNum, episodeNum, value,
  } = req.body;
  if (value > 5 || value < 0) {
    return res.status(400).json({ error: 'Rating couldn\'t be added to the database' });
  }

  // TODO Use JSON web token - much quicker
  return steemConnectAPI.me()
    .then((steemUser) => {
      User.findOne({ username: steemUser.name })
        .then((user) => {
          if (user) {
            Rating.findOne({
              user, mediaType, tmdbid, seasonNum, episodeNum,
            }).then((rating) => {
              if (rating) {
                if (value === 0) {
                  return Rating.findOne({
                    mediaType, tmdbid, seasonNum, episodeNum,
                  }).remove().then(() => res.json({}));
                }
                return Rating.findOneAndUpdate({
                  mediaType, tmdbid, seasonNum, episodeNum,
                }, { score: value }, { new: true }).populate('user', 'username').then(newRating => res.json(newRating));
              }
              return new Rating({
                user, mediaType, tmdbid, seasonNum, episodeNum, score: value,
              }).save().then((newRating) => {
                user.ratings.push(newRating);
                user.save().then(() => res.json(newRating));
              });
            });
          } else {
            res.status(400).json({ error: 'Not authenticated' });
          }
        });
    })
    .catch(() => res.status(400).json({ error: 'Not authenticated' }));
});

module.exports = router;
