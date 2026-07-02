const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateSummary = async (text) => {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Summarize this study material.

Provide:
1. Short Summary
2. Key Points
3. Important Concepts

${text}
`,
        },
      ],
    });

  return completion.choices[0].message.content;
};

const generateQuiz = async (text) => {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Generate exactly 10 MCQs.

Return ONLY JSON.

[
 {
  "question":"",
  "options":["","","",""],
  "answer":""
 }
]

${text}
`,
        },
      ],
    });

  return completion.choices[0].message.content;
};

const generateFlashcards = async (text) => {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Generate 15 flashcards.

Return ONLY JSON.

[
 {
  "front":"",
  "back":""
 }
]

${text}
`,
        },
      ],
    });

  return completion.choices[0].message.content;
};

const askDocumentQuestion = async (
  documentText,
  question
) => {
  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `
Document:

${documentText}

Question:

${question}

Answer only using the document.
`,
        },
      ],
    });

  return completion.choices[0].message.content;
};

const generateTopicContent = async (topic) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
You are an AI Teacher.

Topic: ${topic}

Generate:
1. Detailed Summary
2. 10 MCQ Questions
3. 10 Flashcards

Return ONLY valid JSON in this exact format:

{
  "summary": "...",
  "quiz": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "..."
    }
  ],
  "flashcards": [
    {
      "front": "...",
      "back": "..."
    }
  ]
}
`,
      },
    ],
  });

  return completion.choices[0].message.content;
};

module.exports = {
  generateSummary,
  generateQuiz,
  generateFlashcards,
  generateTopicContent,
  askDocumentQuestion,
};