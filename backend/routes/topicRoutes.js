const express =
  require("express");

const router =
  express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  learnTopic,
} = require(
  "../controllers/topicController"
);

router.post(
  "/learn",
  protect,
  learnTopic
);

module.exports = router;