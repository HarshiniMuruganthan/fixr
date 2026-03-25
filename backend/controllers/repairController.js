const RepairRequest = require("../models/RepairRequest");

// Create repair request
exports.createRepairRequest = async (req, res) => {
  try {
    const { title, description, location, budget } = req.body;

    const repair = await RepairRequest.create({
      user: req.user._id,
      title,
      description,
      location,
      budget,
    });

    res.status(201).json(repair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all repair requests
exports.getRepairRequests = async (req, res) => {
  try {
    const repairs = await RepairRequest.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single repair
exports.getRepairById = async (req, res) => {
  try {
    const repair = await RepairRequest.findById(req.params.id).populate("user", "name email");

    if (!repair) {
      return res.status(404).json({ message: "Repair document with ID " + req.params.id + " not found in DB" });
    }

    res.json(repair);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get repairs for a specific user
exports.getMyRepairs = async (req, res) => {
  try {
    const repairs = await RepairRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark repair as completed
exports.completeRepair = async (req, res) => {
  try {
    const repair = await RepairRequest.findById(req.params.id);
    if (!repair) return res.status(404).json({ message: "Repair not found" });

    // Log for debugging
    console.log("DEBUG completeRepair - User:", req.user._id, "Role:", req.user.role);
    console.log("DEBUG completeRepair - Repair Owner:", repair.user, "Assigned Tech:", repair.assignedTechnician);

    // Authorization: only the assigned technician or an admin can complete it
    const isAssignedTech = repair.assignedTechnician && repair.assignedTechnician.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isAssignedTech && !isAdmin) {
      console.log(`[AUTH FAIL] User ${req.user._id} tried completing repair assigned to ${repair.assignedTechnician}`);
      return res.status(403).json({ 
        message: "Only the assigned technician can mark this job as completed",
        debug: {
          userId: req.user._id,
          userRole: req.user.role,
          repairTech: repair.assignedTechnician
        }
      });
    }

    repair.status = "completed";
    await repair.save();

    res.json({ message: "Repair marked as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get repairs assigned to a specific technician
exports.getTechnicianJobs = async (req, res) => {
  try {
    const repairs = await RepairRequest.find({
      assignedTechnician: req.user._id,
      status: { $in: ["in_progress", "completed"] }
    }).populate("user", "name email").sort({ createdAt: -1 });
    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};