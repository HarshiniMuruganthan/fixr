const Review = require("../models/Review");

// Create review
exports.createReview = async (req, res) => {
  try {
    console.log(req.body);

    const { technicianId, rating, comment } = req.body;

    const review = await Review.create({
      technician: technicianId,   
      user: req.user._id,
      rating,
      comment
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get reviews for technician
exports.getReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      technician: req.params.technicianId
    }).populate("user", "name");

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};