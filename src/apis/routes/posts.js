const express = require('express');
const Post = require('../models/Post');
const passport = require('passport');
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
    postType = 'all',
    sortBy = 'created',
    mediaType,
    type,
    tmdbid,
    seasonNum,
    episodeNum,
    rating,
    author,
    limit = 10,
    createdBefore,
    startAuthor,
    startPermlink,
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
      tag = `reviewapp-${mediaType}-reviews`;
    } else {
      // general tag for all posts (will be changed when name)
      tag = 'reviewapp-reviews';
    }
    // query the steem api for posts matching sort
    steemAPI[`getDiscussionsBy${uppercaseSortBy}Async`]({
      tag,
      limit,
      truncate_body: 1,
      start_author: startAuthor && startAuthor,
      start_permlink: startPermlink && startPermlink,
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
          res.json({
            results: (!!startAuthor && !!startPermlink) ? posts.slice(1) : posts,
          });
        });
      } else {
        // return empty array if no matching steem posts
        res.json({
          results: [],
        });
      }
    });
  } else {
    let countQuery = {};
    const query = {};
    // construct query
    let postLimit = parseInt(limit, 10);
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
    countQuery = { ...query };
    if (createdBefore) {
      postLimit += 1;
      query.createdAt = { $lte: createdBefore };
    }
    // find the total number of posts and return the newest 20
    Promise.all([
      Post.count(countQuery),
      Post.find(query)
        .sort({ createdAt: -1 })
        .limit(postLimit),
    ]).then((data) => {
      // return the total count and an array of posts
      res.json({
        count: data[0],
        results: createdBefore ? data[1].slice(1) : data[1],
      });
    });
  }
});

// TODO: Add season and show updates

router.post('/update-metadata', (req, res) => {
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
    tmdbid,
    seasonNum,
    episodeNum,
  } = req.body;
  if (!author || !permlink || !postType || !mediaType || !tmdbid || (mediaType === 'season' && !seasonNum) || (mediaType === 'episode' && (!seasonNum || !episodeNum))) {
    // return error if wrong paramaters given
    res.status(400).json({ error: 'Post couldn\'t be updated' });
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
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { user } = req;
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

  if (user.username !== author) {
    res.status(401).json({ error: 'Unauthorised' });
  }

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
