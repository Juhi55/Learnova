const fs = require("fs");
const pdf = require("pdf-parse");

const extractPdfText = async (filePath) => {
  try {
    console.log("PDF EXTRACTION STARTED");
    console.log("FILE PATH:", filePath);
    console.log("FILE EXISTS:", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      console.error("FILE NOT FOUND AT PATH:", filePath);
      return "";
    }

    const dataBuffer = fs.readFileSync(filePath);
    console.log("BUFFER SIZE:", dataBuffer.length, "bytes");

    const data = await pdf(dataBuffer);

    console.log("EXTRACTED TEXT LENGTH:", data.text?.length);
    console.log("TEXT PREVIEW:", data.text?.slice(0, 200));

    if (!data.text || data.text.trim().length === 0) {
      console.warn("WARNING: PDF is scanned/image-based. No text layer found.");
    }

    return data.text || "";
  } catch (error) {
    console.error("PDF EXTRACTION ERROR:", error.message);
    return "";
  }
};

module.exports = { extractPdfText };