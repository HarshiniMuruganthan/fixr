const mongoose = require("mongoose");

const repairRequestSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  itemName: String,
  issue: String,
  location: String,
  status: {
    type: String,
    default: "pending"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("RepairRequest", repairRequestSchema);