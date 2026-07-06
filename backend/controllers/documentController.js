const Document = require("../models/Document");
const { extractPdfText } = require("../services/pdfService");

// Upload Document
const uploadDocument = async (req, res) => {
  try {
    console.log("UPLOAD HANDLER REACHED");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("FILE PATH FROM MULTER:", req.file.path);

    const extractedText = await extractPdfText(req.file.buffer);

    console.log("FINAL EXTRACTED TEXT LENGTH:", extractedText?.length);

    const document = await Document.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      extractedText: extractedText || "",
    });

    console.log("DOCUMENT SAVED, ID:", document._id);
    console.log("EXTRACTED TEXT IN DB:", document.extractedText?.length, "characters");

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        _id: document._id,
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        extractedTextLength: document.extractedText?.length,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error("UPLOAD DOCUMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.id })
      .select("-extractedText")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("GET DOCUMENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { uploadDocument, getDocuments };