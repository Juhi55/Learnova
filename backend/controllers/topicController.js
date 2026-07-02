const TopicLearning =
  require("../models/TopicLearning");

const {
  generateTopicContent,
} = require(
  "../services/geminiService"
);

const learnTopic = async (
  req,
  res
) => {
  try {

    const { topic } = req.body;

    const aiResponse =
      await generateTopicContent(
        topic
      );

    const cleaned =
      aiResponse
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          "");

    const data =
      JSON.parse(cleaned);

    const topicData =
      await TopicLearning.create({
        userId: req.user.id,

        topic,

        summary:
          data.summary,

        quiz:
          data.quiz,

        flashcards:
          data.flashcards,
      });

    res.json({
      success: true,
      topicData,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

module.exports = {
  learnTopic,
};