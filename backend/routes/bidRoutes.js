const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createBid,
  getBidsForRepair,
} = require("../controllers/bidController");

router.post("/", protect, createBid);
router.get("/:repairRequestId", protect, getBidsForRepair);

module.exports = router;