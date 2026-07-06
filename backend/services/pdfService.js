const pdf = require("pdf-parse");

const extractPdfText = async (buffer) => {
  try {
    const data = await pdf(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF Extraction Error:", error);
    return "";
  }
};

module.exports = { extractPdfText };