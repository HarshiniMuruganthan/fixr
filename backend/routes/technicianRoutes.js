const express = require("express");
const router = express.Router();

const { searchTechnicians, getAllTechnicians, getTechnicianProfile, getCustomers } = require("../controllers/technicianController");
const protect = require("../middleware/authMiddleware");

router.get("/search", searchTechnicians);
router.get("/customers", protect, getCustomers); // added
router.get("/", getAllTechnicians);
router.get("/:id", getTechnicianProfile);

module.exports = router;