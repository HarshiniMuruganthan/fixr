const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRepairRequest,
  getRepairRequests,
  getMyRepairs,
  getRepairById,
  completeRepair,
  getTechnicianJobs
} = require("../controllers/repairController");

router.post("/", protect, createRepairRequest);
router.get("/", protect, getRepairRequests);
router.get("/my", protect, getMyRepairs);
router.get("/assigned", protect, getTechnicianJobs);
router.get("/:id", protect, getRepairById);
router.put("/:id/complete", protect, completeRepair);

module.exports = router;