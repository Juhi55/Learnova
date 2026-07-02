const Document = require("../models/Document");
const Quiz = require("../models/Quiz");
const { generateQuiz } = require("../services/geminiService");

const createQuiz = async (req, res) => {
  try {
    const { documentId } = req.body;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    if (!document.extractedText || document.extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No extracted text found in document",
      });
    }

    const quizText = await generateQuiz(document.extractedText);

    const cleaned = quizText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI-generated quiz",
      });
    }

    const quiz = await Quiz.create({
      userId: req.user.id,
      documentId,
      questions,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id })
      .populate("documentId", "fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Get Quizzes Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createQuiz, getQuizzes };

