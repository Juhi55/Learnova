
const Chat =
  require("../models/Chat");

const {
  askAI,
} = require(
  "../services/groqService"
);

const sendMessage =
  async (req, res) => {
    try {

      const { message } =
        req.body;

      const answer =
        await askAI(message);

      const chat =
        await Chat.create({
          userId:
            req.user.id,
          question:
            message,
          answer,
        });
        await addPoints(
  req.user.id,
  2
);

      res.json({
        success: true,
        chat,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

const getChats =
  async (req, res) => {
    try {

      const chats =
        await Chat.find({
          userId:
            req.user.id,
        }).sort({
          createdAt: 1,
        });

      res.json({
        success: true,
        chats,
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
  sendMessage,
  getChats,
};

