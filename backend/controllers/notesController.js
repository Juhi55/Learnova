const { generateSummary } = require("../services/geminiService");

const generateFromText = async (req, res) => {
  try {
    const { text, courseName } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No text provided.",
      });
    }

    const trimmedText = text.slice(0, 15000);
    const summaryText = await generateSummary(trimmedText);

    res.status(200).json({
      success: true,
      summary: {
        summary: summaryText,
        courseName: courseName || "",
      },
    });
  } catch (error) {
    console.error("Notes Generation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { generateFromText };