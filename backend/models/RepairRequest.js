const mongoose = require("mongoose");

const repairRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "pending", "in_progress", "completed"],
      default: "open",
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: String,
    budget: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("RepairRequest", repairRequestSchema);