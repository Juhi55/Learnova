const Document = require("../models/Document");
const Summary = require("../models/Summary");
const { generateSummary } = require("../services/geminiService");

const createSummary = async (req, res) => {
  try {
    const { documentId } = req.body;

    console.log("SUMMARY REQUEST FOR DOC ID:", documentId);

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    console.log("DOCUMENT FOUND:", document.fileName);
    console.log("EXTRACTED TEXT LENGTH:", document.extractedText?.length);

    if (!document.extractedText || document.extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No text could be extracted from this document.",
      });
    }

    console.log("SENDING TO GEMINI...");
    const summaryText = await generateSummary(document.extractedText);
    console.log("GEMINI RESPONSE LENGTH:", summaryText?.length);

    const summary = await Summary.create({
      userId: req.user.id,
      documentId,
      summary: summaryText,
    });

    res.status(201).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("SUMMARY GENERATION ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.user.id })
      .populate("documentId", "fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      summaries,
    });
  } catch (error) {
    console.error("GET SUMMARIES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createSummary, getSummaries };