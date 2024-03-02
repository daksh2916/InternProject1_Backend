const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const scoreSchema = mongoose.Schema(
  {
    score: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Add plugin that converts mongoose to json
scoreSchema.plugin(toJSON);
scoreSchema.plugin(paginate);

/**
 * @typedef Score
 */
const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
