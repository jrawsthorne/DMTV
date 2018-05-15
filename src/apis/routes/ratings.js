const express = require('express');
const passport = require('passport');
const Rating = require('../models/Rating');

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

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {
    user,
    body: {
      mediaType, tmdbid, seasonNum, episodeNum, value,
    },
  } = req;
  if (value > 5 || value < 0) {
    return res.status(400).json({ error: 'Rating couldn\'t be added to the database' });
  }
  return Rating.findOne({
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
});

module.exports = router;
