const mongoose = require("mongoose");

const ClimbSchema = new mongoose.Schema({
  climbType: { type: String, required: true },   // boulder, sport, top-rope, etc
  grade: { type: String, required: true },       // V3, 5.10b, etc
  attempts: { type: Number, required: true },    // integer count
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Climb", ClimbSchema);
