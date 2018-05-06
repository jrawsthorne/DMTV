const express = require('express');
const Post = require('../models/Post');
const theMovieDBAPI = require('../theMovieDBAPI');
const _ = require('lodash');

const router = express.Router();

router.get('/@:author/:permlink', (req, res) => {
  const { author, permlink } = req.params;
  Post.findOne({ author, permlink })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post couldn't be found" });
      }
      return res.json(post);
    });
});

router.get('/', (req, res) => {
  const {
    postType = 'all', mediaType, tmdbid, seasonNum, episodeNum, rating, limit = 20,
  } = req.query;
  const query = {};
  if (mediaType) query.mediaType = mediaType;
  if (tmdbid) query.tmdbid = tmdbid;
  if (seasonNum) query.seasonNum = seasonNum;
  if (episodeNum) query.episodeNum = episodeNum;
  if (rating) query.rating = rating;
  if (postType !== 'all') {
    query.postType = postType;
  }
  Post.count(query)
    .then((count) => {
      Post.find(query).limit(limit)
        .then(posts => res.json({
          count,
          results: posts,
        }));
    });
});

// TODO: Add season and show updates

router.post('/update-metadata', (req, res) => {
  const { testing_token: testingToken } = req.cookies;
  if (!testingToken || testingToken !== process.env.TESTING_TOKEN) {
    return res.status(400).json({ error: 'Not authenticated' });
  }
  const {
    author,
    permlink,
    postType,
    mediaType,
    tmdbid,
    seasonNum,
    episodeNum,
  } = req.body;
  if (!author || !permlink || !postType || !mediaType || !tmdbid || (mediaType === 'season' && !seasonNum) || (mediaType === 'episode' && (!seasonNum || !episodeNum))) {
    return res.status(400).json({ error: 'Post couldn\'t be updated' });
  }
  return Post.findOne({
    author, permlink, postType, mediaType, tmdbid, seasonNum, episodeNum,
  })
    .then((post) => {
      if (!post) return res.status(404).json({ error: "Post couldn't be found" });
      if (mediaType === 'movie') {
        theMovieDBAPI.movieInfo(tmdbid)
          .then(movie => Post.findOneAndUpdate({
            author, permlink, postType, mediaType, tmdbid,
          }, { posterPath: movie.poster_path, backdropPath: movie.backdrop_path }, { new: true })
            .then(newPost => res.json(newPost)));
      } else if (mediaType === 'episode') {
        return theMovieDBAPI.tvInfo({
          id: tmdbid,
          append_to_response: `season/${seasonNum}`,
        }).then((show) => {
          // if episode not found in episodes object throw error
          if (!_.get(show, `[season/${seasonNum}].episodes`) || !_.get(show, `[season/${seasonNum}].episodes`).find(episode => episode.episode_number === parseInt(episodeNum, 10))) {
            return res.status(404).json({ error: 'Episode not found' });
          }
          return Post.findOneAndUpdate({
            author, permlink, postType, mediaType, tmdbid, seasonNum, episodeNum,
          }, {
            posterPath: show.poster_path,
            backdropPath: show.backdrop_path,
            seasonPath: _.get(show, `[season/${seasonNum}].poster_path`),
            episodePath: _.get(show[`season/${seasonNum}`].episodes.find(episode => episode.episode_number === parseInt(episodeNum, 10)), 'still_path'),
          }, { new: true })
            .then(newPost => res.json(newPost));
        })
          .catch(err => res.json({ error: err.toString().replace('Error: ', '') }));
      }
      return post;
    });
});

// add an existing post to the database
// requires testingToken during development phase
router.post('/add', (req, res) => {
  const { testing_token: testingToken } = req.cookies;
  if (!testingToken || testingToken !== process.env.TESTING_TOKEN) {
    return res.status(400).json({ error: 'Not authenticated' });
  }
  const {
    author,
    permlink,
    postType,
    mediaType,
    tmdbid,
    seasonNum,
    episodeNum,
    rating,
    title,
    posterPath,
    backdropPath,
    episodePath,
    seasonPath,
  } = req.body;

  const newPost = new Post({
    author,
    permlink,
    postType,
    mediaType,
    tmdbid,
    title,
    posterPath: posterPath || undefined,
    backdropPath: backdropPath || undefined,
    episodePath: episodePath || undefined,
    seasonPath: seasonPath || undefined,
    seasonNum: seasonNum || undefined,
    episodeNum: episodeNum || undefined,
    rating: rating || undefined,
  });

  return newPost.save()
    .then(post => res.json(post))
    .catch(() => res.status(400).json({ error: 'Post couldn\'t be added to the database' }));
});

module.exports = router;
