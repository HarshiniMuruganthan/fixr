const Bid = require("../models/Bid");
const RepairRequest = require("../models/RepairRequest");

// Create bid
exports.createBid = async (req, res) => {
  try {
    const { repairRequestId, price, message } = req.body;

    const bid = await Bid.create({
      repairRequest: repairRequestId,
      technician: req.user._id,
      price,
      message
    });

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bids for a repair request
exports.getBidsForRepair = async (req, res) => {
  try {
    const bids = await Bid.find({ repairRequest: req.params.repairRequestId })
      .populate("technician", "name email");

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bids for a technician
exports.getMyBids = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not identified" });
    }

    const bids = await Bid.find({ technician: req.user._id })
      .populate("repairRequest", "title location budget status")
      .sort({ createdAt: -1 });

    res.json(bids || []);
  } catch (error) {
    console.error("getMyBids error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Accept a bid
exports.acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    // Mark this bid as accepted
    bid.status = "accepted";
    await bid.save();

    // Mark other bids for same repair as rejected
    await Bid.updateMany(
      { repairRequest: bid.repairRequest, _id: { $ne: bid._id } },
      { $set: { status: "rejected" } }
    );

    // Update Repair Request status and assign technician
    await RepairRequest.findByIdAndUpdate(bid.repairRequest, {
      status: "in_progress",
      assignedTechnician: bid.technician
    });

    res.json({ message: "Bid accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};