const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  youtubeUrl: { type: String, required: true },
  sessionName: { type: String, required: true, unique: true },
  adminName: { type: String, required: true },
  participants: [{ type: String }],
  currentTime: { type: Number, default: 0 },
  isPlaying: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Session", SessionSchema);
