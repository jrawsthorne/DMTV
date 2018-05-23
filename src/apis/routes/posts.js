const express = require('express');
const Post = require('../models/Post');
const theMovieDBAPI = require('../theMovieDBAPI');
const steemAPI = require('../steemAPI');
const _ = require('lodash');

const router = express.Router();

router.get('/@:author/:permlink', (req, res) => {
  const { author, permlink } = req.params;

  // find the post
  Post.findOne({ author, permlink }).then((post) => {
    if (!post) {
      // return error if the post isn't found
      res.status(404).json({ error: "Post couldn't be found" });
    }
    // return the post
    res.json(post);
  });
});

router.get('/', (req, res) => {
  const {
    postType = 'all', sortBy = 'created', mediaType, type, tmdbid, seasonNum, episodeNum, rating, author, limit = 20,
  } = req.query;
  if (episodeNum && !seasonNum) {
    // return error if episode but no season specified
    res.status(404).json('Posts not found, please specify a season number as well');
  }
  // need to query steem if sortBy not created
  if (sortBy !== 'created') {
    // api requires upper case sort
    const uppercaseSortBy = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
    let tag;
    if (mediaType) {
      // add mediaType to tag if present (will be changed when name)
      tag = `review.app-${mediaType}-reviews`;
    } else {
      // general tag for all posts (will be changed when name)
      tag = 'review.app-reviews';
    }
    // query the steem api for posts matching sort
    steemAPI[`getDiscussionsBy${uppercaseSortBy}Async`]({
      tag, limit, truncate_body: 1,
    }).then((steemPosts) => {
      if (steemPosts.length > 0) {
        // construct query that matches all returned posts
        const query = {
          $or: steemPosts.map(post => ({
            author: post.author,
            permlink: post.permlink,
          })),
        };
        // find posts
        Post.find(query).then((posts) => {
          // return posts
          res.json(posts);
        });
      } else {
        // return empty array if no matching steem posts
        res.json([]);
      }
    });
  } else {
    const query = {};
    // construct query
    if (mediaType) query.mediaType = mediaType;
    if (type) query.type = type;
    if (tmdbid) query.tmdbid = tmdbid;
    if (seasonNum) query.seasonNum = seasonNum;
    if (episodeNum) query.episodeNum = episodeNum;
    if (rating) query.rating = rating;
    if (author) query.author = author;
    if (postType !== 'all') {
      query.postType = postType;
    }
    // find the total number of posts and return the newest 20
    Promise.all([
      Post.count(query),
      Post.find(query).sort({ createdAt: -1 }).limit(limit),
    ]).then((data) => {
      // return the total count and an array of posts
      res.json({
        count: data[0],
        results: data[1],
      });
    });
  }
});

// TODO: Add season and show updates

router.post('/update-metadata', (req, res) => {
  const { testing_token: testingToken } = req.cookies;
  if (!testingToken || testingToken !== process.env.TESTING_TOKEN) {
    // return error if no testing token
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
    // return error if wrong paramaters given
    return res.status(400).json({ error: 'Post couldn\'t be updated' });
  }

  // find the post
  Post.findOne({
    author, permlink, postType, mediaType, tmdbid, seasonNum, episodeNum,
  }).then((post) => {
    // return error if post not found
    if (!post) res.status(404).json({ error: "Post couldn't be found" });
    if (mediaType === 'movie') {
      // find the movie
      theMovieDBAPI.movieInfo(tmdbid).then((movie) => {
        // find the post and update it with new metadata
        Post.findOneAndUpdate({
          author,
          permlink,
          postType,
          mediaType,
          tmdbid,
        }, { posterPath: movie.poster_path, backdropPath: movie.backdrop_path }, { new: true })
          .then((newPost) => {
            // return the new post
            res.json(newPost);
          });
      });
    } else if (mediaType === 'episode') {
      theMovieDBAPI.tvInfo({
        id: tmdbid,
        append_to_response: `season/${seasonNum}`,
      }).then((show) => {
        // if episode not found in episodes object throw error
        if (!_.get(show, `[season/${seasonNum}].episodes`) || !_.get(show, `[season/${seasonNum}].episodes`).find(episode => episode.episode_number === parseInt(episodeNum, 10))) {
          res.status(404).json({ error: 'Episode not found' });
        }
        Post.findOneAndUpdate(
          {
            author,
            permlink,
            postType,
            mediaType,
            tmdbid,
            seasonNum,
            episodeNum,
          },
          {
            posterPath: show.poster_path,
            backdropPath: show.backdrop_path,
            seasonPath: _.get(show, `[season/${seasonNum}].poster_path`),
            episodePath: _.get(show[`season/${seasonNum}`].episodes.find(episode => episode.episode_number === parseInt(episodeNum, 10)), 'still_path'),
          },
          { new: true },
        )
          .then((newPost) => {
            // return the new post
            res.json(newPost);
          });
      })
        .catch(() => res.status(400).json({
          error: 'There was an error updating the post',
        }));
    } else {
      // just return the original post
      res.json(post);
    }
  });
});

// add an existing post to the database
// requires testingToken during development phase
router.post('/add', (req, res) => {
  const { testing_token: testingToken } = req.cookies;
  if (!testingToken || testingToken !== process.env.TESTING_TOKEN) {
    // return error if no testing token
    res.status(400).json({ error: 'Not authenticated' });
  }
  const {
    author,
    permlink,
    postType,
    mediaType,
    type,
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
    type,
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

  // add the post
  newPost.save().then((post) => {
    // return the new post
    res.json(post);
  })
    .catch(() => {
      // return error if fails
      res.status(400).json({ error: 'Post couldn\'t be added to the database' });
    });
});

module.exports = router;
