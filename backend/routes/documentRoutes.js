const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const protect = require("../middleware/authMiddleware");

const {
  uploadDocument,
  getDocuments,
} = require("../controllers/documentController");

// Get all documents of logged-in user
router.get(
  "/",
  protect,
  getDocuments
);

// Upload document
router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadDocument
);

module.exports = router;