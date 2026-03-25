const User = require("../models/User");

// Search technicians by service and city
exports.searchTechnicians = async (req, res) => {
  try {
    const { service, city } = req.query;

    const searchQuery = { role: "technician" };
    if (service) searchQuery.service = service;
    if (city) searchQuery["location.city"] = { $regex: city, $options: "i" }; // case-insensitive regex for city

    const technicians = await User.find(searchQuery).select("-password");

    res.json(technicians);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all technicians
exports.getAllTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: "technician" }).select("-password");
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single technician profile with reviews
exports.getTechnicianProfile = async (req, res) => {
  try {
    const technician = await User.findById(req.params.id).select("-password");
    if (!technician || technician.role !== "technician") {
      return res.status(404).json({ message: "Technician not found" });
    }

    const Review = require("../models/Review");
    const reviews = await Review.find({ technician: req.params.id }).populate("user", "name");

    res.json({ technician, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all customers (for technicians to chat with)
exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};