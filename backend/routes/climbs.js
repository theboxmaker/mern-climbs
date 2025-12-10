const express = require("express");
const router = express.Router();
const Climb = require("../models/Climb");
const auth = require("../middleware/auth");

// GET ALL CLIMBS (public)
router.get("/", async (req, res) => {
  try {
    const climbs = await Climb.find().sort({ createdAt: -1 });
    res.json(climbs);
  } catch (err) {
    console.error("Error loading climbs:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADD CLIMB (protected)
router.post("/", auth, async (req, res) => {
  try {
    const climb = new Climb(req.body);
    await climb.save();
    res.json(climb);
  } catch (err) {
    console.error("Error saving climb:", err);
    res.status(400).json({
      message: "Invalid climb data",
      details: err.message,
    });
  }
});

// UPDATE CLIMB (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Climb.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating climb:", err);
    res.status(400).json({
      message: "Invalid update",
      details: err.message,
    });
  }
});

// DELETE CLIMB (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Climb.findByIdAndDelete(req.params.id);
    res.json({ message: "Climb deleted" });
  } catch (err) {
    console.error("Error deleting climb:", err);
    res.status(500).json({
      message: "Could not delete climb",
      details: err.message,
    });
  }
});

module.exports = router;
