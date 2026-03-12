const Bid = require("../models/Bid");

// Create bid
exports.createBid = async (req, res) => {
  try {
    const { repairRequestId, price, message } = req.body;

    const bid = await Bid.create({
      repairRequest: repairRequestId,   // matches schema
      technician: req.user._id,         // logged-in technician
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