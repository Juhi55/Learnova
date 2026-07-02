const Document = require("../models/Document");
const Flashcard = require("../models/Flashcard");
const { generateFlashcards } = require("../services/geminiService");

const createFlashcards = async (req, res) => {
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

    const flashcardText = await generateFlashcards(document.extractedText);

    const cleaned = flashcardText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let cards;
    try {
      cards = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI-generated flashcards",
      });
    }

    const flashcards = await Flashcard.create({
      userId: req.user.id,
      documentId,
      cards,
    });

    res.status(201).json({
      success: true,
      flashcards,
    });
  } catch (error) {
    console.error("Flashcard Generation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ userId: req.user.id })
      .populate("documentId", "fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      flashcards,
    });
  } catch (error) {
    console.error("Get Flashcards Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createFlashcards, getFlashcards };