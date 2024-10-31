const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Debugging middleware
router.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});

// Audio info route - this MUST come before the /:sessionId route
router.get("/audio-info", sessionController.getAudioInfo);

router.post("/", sessionController.createSession);
router.get("/:sessionId", sessionController.getSession);
router.get("/session/:sessionName", sessionController.getSessionByName);
router.post("/:sessionId/join", sessionController.joinSession);
router.get("/:sessionId/sync", sessionController.getSyncStatus); // Add this line
router.post("/:sessionId/sync", sessionController.syncAudio);
// Add this to your routes file (e.g., sessionRoutes.js)
router.post("/:sessionId/leave", sessionController.leaveSession);

module.exports = router;
