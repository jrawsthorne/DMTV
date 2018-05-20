const express = require('express');
const passport = require('passport');
const Rating = require('../models/Rating');

const router = express.Router();

router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {
    user,
    body: {
      mediaType, tmdbid, seasonNum, episodeNum, value,
    },
  } = req;
  // return error if score invalid
  if (value > 5 || value < 0) {
    res.status(400).json({ error: 'Rating couldn\'t be added to the database' });
  }
  // find the rating
  Rating.findOne({
    user,
    mediaType,
    tmdbid,
    seasonNum,
    episodeNum,
  }).then((rating) => {
    if (rating) {
      if (parseInt(value, 10) === 0) {
        // remove rating if score is 0
        rating.remove().then(() => {
          // remove rating id from user
          user.update({ $pull: { ratings: rating.id } }).then(() => {
            // return empty object
            res.json({});
          });
        });
      } else {
        // update the score for the rating
        rating.update({ $set: { score: value } }).then(() => {
          // return the rating with the new score
          res.json({
            mediaType: rating.mediaType,
            tmdbid: rating.tmdbid,
            score: parseInt(value, 10),
            seasonNum: rating.seasonNum || undefined,
            episodeNum: rating.episodeNum || undefined,
          });
        });
      }
    } else {
      // create a new rating
      new Rating({
        user,
        mediaType,
        tmdbid,
        seasonNum,
        episodeNum,
        score: value,
      }).save().then(newRating =>
        // add the rating id to the user
        user.update({ $push: { ratings: { _id: newRating.id } } }).then(() => {
          // return the new rating
          res.json({
            mediaType: newRating.mediaType,
            tmdbid: newRating.tmdbid,
            score: newRating.score,
            seasonNum: newRating.seasonNum || undefined,
            episodeNum: newRating.episodeNum || undefined,
          });
        }));
    }
  });
});

module.exports = router;
