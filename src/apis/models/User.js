const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: 'subscriptions' }],
    ratings: [{ type: Schema.Types.ObjectId, ref: 'ratings' }],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('users', schema);
