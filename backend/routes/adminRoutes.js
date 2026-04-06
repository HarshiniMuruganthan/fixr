const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  deleteUser,
  getAllRepairs,
  toggleVerify,
  toggleSuspend,
  deleteRepair,
  getSettings,
  updateSettings,
} = require("../controllers/adminController");

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/verify", toggleVerify);
router.patch("/users/:id/suspend", toggleSuspend);

router.get("/repairs", getAllRepairs);
router.delete("/repairs/:id", deleteRepair);

router.get("/settings", getSettings);
router.patch("/settings", updateSettings);

module.exports = router;