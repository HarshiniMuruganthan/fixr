const User = require("../models/User");
const RepairRequest = require("../models/RepairRequest");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all repair requests (admin)
exports.getAllRepairs = async (req, res) => {
  try {
    const repairs = await RepairRequest.find().populate("user", "name email");
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};