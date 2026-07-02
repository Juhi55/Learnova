const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    questions: [
      {
        question: String,
        options: [String],
        answer: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Quiz",
  quizSchema
);