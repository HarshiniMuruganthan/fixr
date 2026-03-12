const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getAllUsers,
  deleteUser,
  getAllRepairs,
} = require("../controllers/adminController");

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);
router.get("/repairs", protect, authorizeRoles("admin"), getAllRepairs);

module.exports = router;