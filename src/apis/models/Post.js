const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    permlink: {
      type: String,
      required: true,
    },
    postType: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    tmdbid: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
    },
    backdropPath: {
      type: String,
    },
    episodePath: {
      type: String,
    },
    seasonPath: {
      type: String,
    },
    seasonNum: {
      type: Number,
    },
    episodeNum: {
      type: Number,
    },
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

/* Each author and permlink combination must be unique */
schema.index({ author: 1, permlink: 1 }, { unique: true });
module.exports = mongoose.model('posts', schema);
