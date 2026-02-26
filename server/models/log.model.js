const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    students: {
      type: Number,
      required: true,
      min: 1,
    },
    needsAC: {
      type: Boolean,
      required: true,
    },
    needsWashroom: {
      type: Boolean,
      required: true,
    },
    allocatedRoom: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("AllocationLog", logSchema);
