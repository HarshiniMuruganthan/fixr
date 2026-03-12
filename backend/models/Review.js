const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: Number,
  comment: String
},
{ timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);