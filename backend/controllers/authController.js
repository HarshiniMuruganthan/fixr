const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, service, city, area } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      service, // added
      location: { // added
        city,
        area
      }
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      service: user.service,
      location: user.location,
      bio: user.bio,
      yearsOfExperience: user.yearsOfExperience,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        service: user.service,
        location: user.location,
        bio: user.bio,
        yearsOfExperience: user.yearsOfExperience,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      user.service = req.body.service || user.service;
      
      const city = req.body.city || (user.location && user.location.city);
      const area = req.body.area || (user.location && user.location.area);
      
      user.location = { city, area };
      user.bio = req.body.bio ?? user.bio;
      user.yearsOfExperience = req.body.yearsOfExperience ?? user.yearsOfExperience;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        service: updatedUser.service,
        location: updatedUser.location,
        bio: updatedUser.bio,
        yearsOfExperience: updatedUser.yearsOfExperience,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};