const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createBid,
  getBidsForRepair,
  getMyBids,
  acceptBid,
} = require("../controllers/bidController");

router.post("/", protect, createBid);
router.get("/my/all", protect, getMyBids); // changed path
router.get("/:repairRequestId", protect, getBidsForRepair);
router.put("/:id/accept", protect, acceptBid);

module.exports = router;