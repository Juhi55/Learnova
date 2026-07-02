
const Groq =
  require("groq-sdk");

const groq =
  new Groq({
    apiKey:
      process.env.GROQ_API_KEY,
  });

const askAI =
  async (message) => {

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "system",
            content:
              "You are Learnova AI Tutor. Help students learn topics clearly.",
          },
          {
            role: "user",
            content:
              message,
          },
        ],
      });

    return completion
      .choices[0]
      .message.content;
  };

module.exports = {
  askAI,
};

