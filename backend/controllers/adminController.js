const User = require("../models/User");
const RepairRequest = require("../models/RepairRequest");
const SiteSettings = require("../models/SiteSettings");

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

// Update user verification status
exports.toggleVerify = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = !user.isVerified;
    await user.save();
    res.json({ message: `User ${user.isVerified ? 'verified' : 'unverified'}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user suspension status
exports.toggleSuspend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = !user.isSuspended;
    await user.save();
    res.json({ message: `User ${user.isSuspended ? 'suspended' : 'activated'}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// DELETE repair request
exports.deleteRepair = async (req, res) => {
  try {
    const repair = await RepairRequest.findByIdAndDelete(req.params.id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });
    res.json({ message: "Repair removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Site Settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};