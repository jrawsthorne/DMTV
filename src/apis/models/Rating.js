const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
    },
    tmdbid: {
      type: Number,
      required: true,
    },
    seasonNum: {
      type: Number,
    },
    episodeNum: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

/* A user can only have 1 rating per item */
schema.index({
  user: 1, mediaType: 1, tmdbid: 1, seasonNum: 1, episodeNum: 1,
}, { unique: true });
module.exports = mongoose.model('ratings', schema);
