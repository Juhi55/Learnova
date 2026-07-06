const TopicLearning = require("../models/TopicLearning");
const { generateTopicContent } = require("../services/geminiService");

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const learnTopic = async (req, res) => {
  try {
    const { topic } = req.body;

    // Check if topic already exists
    let topicData = await TopicLearning.findOne({
      userId: req.user.id,
      topic,
    });

    if (!topicData) {
      const aiResponse = await generateTopicContent(topic);

      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "");

      const data = JSON.parse(cleaned);

      topicData = await TopicLearning.create({
        userId: req.user.id,
        topic,
        summary: data.summary,
        quiz: data.quiz,
        flashcards: data.flashcards,
      });
    }

    // Randomize questions
    const randomQuiz = shuffle(topicData.quiz).slice(0, 10);

    const shuffledQuiz = [...topicData.quiz]
  .sort(() => Math.random() - 0.5)
  .slice(0, 10);

res.json({
  success: true,
  topicData: {
    ...topicData.toObject(),
    quiz: shuffledQuiz,
  },
});

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { learnTopic };