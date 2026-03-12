const RepairRequest = require("../models/RepairRequest");

// Create repair request
exports.createRepairRequest = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    const repair = await RepairRequest.create({
      user: req.user._id,
      title,
      description,
      location,
    });

    res.status(201).json(repair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all repair requests
exports.getRepairRequests = async (req, res) => {
  try {
    const repairs = await RepairRequest.find().populate("user", "name email");
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single repair
exports.getRepairById = async (req, res) => {
  try {
    const repair = await RepairRequest.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({ message: "Repair not found" });
    }

    res.json(repair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};