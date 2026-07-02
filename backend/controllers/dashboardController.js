const getDashboardStats = async (
  req,
  res
) => {
  try {

    res.json({
      success: true,
      stats: {
        documents: 10,
        summaries: 5,
        quizzes: 3,
        flashcards: 2,
        chats: 8,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getDashboardStats,
};