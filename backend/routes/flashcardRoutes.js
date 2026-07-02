const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  createFlashcards,
  getFlashcards,
} = require(
  "../controllers/flashcardController"
);

router.post(
  "/generate",
  protect,
  createFlashcards
);

router.get(
  "/",
  protect,
  getFlashcards
);

module.exports = router;