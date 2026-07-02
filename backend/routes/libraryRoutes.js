const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  getLibrary,
  getCourseDetails,
} = require(
  "../controllers/libraryController"
);

router.get(
  "/",
  protect,
  getLibrary
);

router.get(
  "/:documentId",
  protect,
  getCourseDetails
);

module.exports = router;