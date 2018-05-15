const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    tmdbid: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

schema.index({ user: 1, tmdbid: 1, type: 1 }, { unique: true });
module.exports = mongoose.model('subscriptions', schema);
