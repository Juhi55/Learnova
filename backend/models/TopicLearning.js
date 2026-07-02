const mongoose = require("mongoose");

const topicLearningSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      topic: {
        type: String,
        required: true,
      },

      summary: String,

      quiz: Array,

      flashcards: Array,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "TopicLearning",
  topicLearningSchema
);