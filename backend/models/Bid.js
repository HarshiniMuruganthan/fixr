const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
{
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  repairRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RepairRequest"
  },
  price: Number,
  message: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);