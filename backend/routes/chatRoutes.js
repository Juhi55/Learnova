
const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/authMiddleware"
  );

const {
  sendMessage,
  getChats,
} = require(
  "../controllers/chatController"
);

router.post(
  "/",
  protect,
  sendMessage
);

router.get(
  "/",
  protect,
  getChats
);

module.exports = router;

