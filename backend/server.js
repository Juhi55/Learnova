const dotenv = require("dotenv");
dotenv.config();

console.log(
  "Groq Key Loaded:",
  !!process.env.GROQ_API_KEY
);

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const quizRoutes = require("./routes/quizRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const topicRoutes = require("./routes/topicRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notesRoutes = require("./routes/notesRoutes");
const libraryRoutes =require("./routes/libraryRoutes");
const dashboardRoutes =require("./routes/dashboardRoutes");


// Middleware
const protect = require("./middleware/authMiddleware");

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static Uploads
app.use(
  "/uploads",
  express.static("uploads")
);

// Root Route
app.get("/", (req, res) => {
  res.send(
    "Learnova Backend Running 🚀"
  );
});

// Auth Routes
app.use(
  "/api/auth",
  authRoutes
);

// Documents
app.use(
  "/api/documents",
  documentRoutes
);

// Summaries
app.use(
  "/api/summaries",
  summaryRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// Quizzes
app.use(
  "/api/quizzes",
  quizRoutes
);

// Flashcards
app.use(
  "/api/flashcards",
  flashcardRoutes
);

// Topics
app.use(
  "/api/topics",
  topicRoutes
);

// AI Tutor
app.use(
  "/api/chat",
  chatRoutes
);

// Notes
app.use("/api/notes", notesRoutes); 

// Library Routes
app.use(
  "/api/library",
  libraryRoutes
);



// Protected Test Route
app.get(
  "/api/profile",
  protect,
  (req, res) => {
    res.json({
      success: true,
      message:
        "Protected Route Accessed",
      user: req.user,
    });
  }
);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      "Route not found",
  });
});

// Library Routes
app.use(
  "/api/library",
  libraryRoutes
);

// Global Error Handler
app.use(
  (err, req, res, next) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});