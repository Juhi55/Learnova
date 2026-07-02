const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  createQuiz,
  getQuizzes,
} = require(
  "../controllers/quizController"
);

router.post(
  "/generate",
  protect,
  createQuiz
);

router.get(
  "/",
  protect,
  getQuizzes
);

module.exports = router;