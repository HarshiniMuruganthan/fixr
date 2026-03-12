const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRepairRequest,
  getRepairRequests
} = require("../controllers/repairController");

router.post("/", protect, createRepairRequest);
router.get("/", protect, getRepairRequests);

module.exports = router;