const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    availableCapacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    hasAC: {
      type: Boolean,
      required: true,
    },
    hasAttachedWashroom: {
      type: Boolean,
      required: true,
    },
    allocatedStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.pre("validate", function preValidate(next) {
  const allocated = this.allocatedStudents || 0;
  this.availableCapacity = Math.max(this.capacity - allocated, 0);
  this.isFull = this.availableCapacity === 0;
  next();
});

roomSchema.index({ availableCapacity: 1 });
roomSchema.index({ hasAC: 1 });
roomSchema.index({ hasAttachedWashroom: 1 });

module.exports = mongoose.model("Room", roomSchema);
