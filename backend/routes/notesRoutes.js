const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { generateFromText } = require("../controllers/notesController");

router.post("/generate-from-text", protect, generateFromText);

module.exports = router;