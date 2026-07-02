const Document = require("../models/Document");
const Summary = require("../models/Summary");
const Quiz = require("../models/Quiz");
const Flashcard = require("../models/Flashcard");

// =======================
// GET LIBRARY
// =======================

const getLibrary = async (req, res) => {
  try {

    const documents = await Document.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    const library = await Promise.all(

      documents.map(async (doc) => {

        const summary =
          await Summary.findOne({
            documentId: doc._id,
          });

        const quiz =
          await Quiz.findOne({
            documentId: doc._id,
          });

        const flashcard =
          await Flashcard.findOne({
            documentId: doc._id,
          });

        return {

          documentId: doc._id,

          fileName:
            doc.fileName,

          createdAt:
            doc.createdAt,

          summaryExists:
            !!summary,

          quizExists:
            !!quiz,

          flashcardExists:
            !!flashcard,

        };
      })

    );

    res.status(200).json({
      success: true,
      library,
    });

  } catch (error) {

    console.error(
      "Library Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =======================
// GET COURSE DETAILS
// =======================

const getCourseDetails = async (
  req,
  res
) => {
  try {

    const { documentId } =
      req.params;

    const document =
      await Document.findById(
        documentId
      );

    if (!document) {
      return res.status(404).json({
        success: false,
        message:
          "Document not found",
      });
    }

    const summary =
      await Summary.findOne({
        documentId,
      });

    const quiz =
      await Quiz.findOne({
        documentId,
      });

    const flashcards =
      await Flashcard.findOne({
        documentId,
      });

    res.status(200).json({
      success: true,

      document,

      summary,

      quiz,

      flashcards,
    });

  } catch (error) {

    console.error(
      "Course Details Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getLibrary,
  getCourseDetails,
};
