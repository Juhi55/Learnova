const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  createSummary,
  getSummaries,
} = require(
  "../controllers/summaryController"
);

router.post(
  "/generate",
  protect,
  createSummary
);

router.get(
  "/",
  protect,
  getSummaries
);

module.exports = router;