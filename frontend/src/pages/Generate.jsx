import { useState, useRef } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "https://learnova-backend-9yuu.onrender.com/api";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

function ResultCard({ title, children }) {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-gray-800 font-bold text-lg mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ─── INTERACTIVE QUIZ ────────────────────────────────────────
function QuizDisplay({ quiz }) {
  const [selected, setSelected] = useState({});
  const labels = ["A", "B", "C", "D"];

  const handleSelect = (questionIndex, optionIndex) => {
    if (selected[questionIndex] !== undefined) return;
    setSelected((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const correctIndex = (q) =>
    q.options.findIndex((opt) => opt.trim() === q.answer.trim());

  const getOptionClass = (q, questionIndex, optionIndex) => {
    const answered = selected[questionIndex] !== undefined;
    const isCorrect = q.options[optionIndex].trim() === q.answer.trim();
    const isSelected = selected[questionIndex] === optionIndex;

    if (!answered) {
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-400 cursor-pointer";
    }
    if (isCorrect) {
      return "bg-emerald-50 text-emerald-700 border-emerald-400 font-semibold";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-50 text-red-600 border-red-400 font-semibold";
    }
    return "bg-gray-50 text-gray-400 border-gray-100 opacity-50";
  };

  const score = Object.keys(selected).filter((i) => {
    const q = quiz[i];
    return q.options[selected[i]]?.trim() === q.answer.trim();
  }).length;

  const allAnswered = Object.keys(selected).length === quiz.length;

  return (
    <div className="space-y-6">
      {quiz.map((q, i) => (
        <div key={i} className="border border-gray-100 rounded-xl p-4">
          <p className="text-gray-800 font-semibold mb-3 text-sm">
            Q{i + 1}. {q.question}
          </p>
          <ul className="space-y-2">
            {q.options.map((opt, j) => {
              const answered = selected[i] !== undefined;
              const isCorrect = opt.trim() === q.answer.trim();
              const isSelected = selected[i] === j;

              return (
                <li
                  key={j}
                  onClick={() => handleSelect(i, j)}
                  className={`px-4 py-2.5 rounded-xl text-sm border transition-all flex items-center gap-2 ${getOptionClass(q, i, j)}`}
                >
                  <span className="font-bold w-5 flex-shrink-0">{labels[j]}.</span>
                  <span className="flex-1">{opt}</span>
                  {answered && isCorrect && <span>✅</span>}
                  {answered && isSelected && !isCorrect && <span>❌</span>}
                </li>
              );
            })}
          </ul>

          {selected[i] !== undefined &&
            q.options[selected[i]]?.trim() !== q.answer.trim() && (
              <p className="mt-2 text-xs text-emerald-600 font-medium">
                ✅ Correct answer:{" "}
                <span className="font-bold">
                  {labels[correctIndex(q)]}. {q.answer}
                </span>
              </p>
            )}
        </div>
      ))}

      {allAnswered && (
        <div
          className={`rounded-xl p-5 text-center border-2 ${
            score === quiz.length
              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
              : score >= quiz.length / 2
              ? "bg-blue-50 text-blue-700 border-blue-300"
              : "bg-red-50 text-red-600 border-red-300"
          }`}
        >
          <p className="text-xl font-bold">
            {score === quiz.length
              ? "🎉 Perfect Score!"
              : score >= quiz.length / 2
              ? "👍 Good Job!"
              : "📚 Keep Studying!"}
          </p>
          <p className="text-base font-medium mt-1">
            You got {score} out of {quiz.length} correct
          </p>
        </div>
      )}
    </div>
  );
}

// ─── PDF MODE ────────────────────────────────────────────────
function PdfMode({ onBack }) {
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleUpload = async () => {
    if (!file) return setError("Please select a PDF file.");
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API}/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setDocumentId(res.data.document._id);
      setUploadDone(true);
      setSummary("");
      setQuiz([]);
      setFlashcards([]);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSummary = async () => {
    setLoadingSummary(true);
    setError("");
    try {
      const res = await axios.post(
        `${API}/summaries/generate`,
        { documentId },
        authHeader()
      );
      setSummary(res.data.summary?.summary || res.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Summary generation failed.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleQuiz = async () => {
    setLoadingQuiz(true);
    setError("");
    try {
      const res = await axios.post(
        `${API}/quizzes/generate`,
        { documentId },
        authHeader()
      );
      const raw = res.data.quiz?.questions || res.data.questions || res.data.quiz;
      const parsed = typeof raw === "string"
        ? JSON.parse(raw.replace(/```json|```/g, "").trim())
        : raw;
      setQuiz(parsed);
    } catch (err) {
      setError(err.response?.data?.message || "Quiz generation failed.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleFlashcards = async () => {
    setLoadingFlashcards(true);
    setError("");
    try {
      const res = await axios.post(
        `${API}/flashcards/generate`,
        { documentId },
        authHeader()
      );
      const raw =
        res.data.flashcards?.cards ||
        res.data.cards ||
        res.data.flashcards;
      const parsed = typeof raw === "string"
        ? JSON.parse(raw.replace(/```json|```/g, "").trim())
        : raw;
      setFlashcards(parsed);
    } catch (err) {
      setError(err.response?.data?.message || "Flashcard generation failed.");
    } finally {
      setLoadingFlashcards(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-6 text-sm font-medium"
      >
        ← Back to Generate
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📄 Upload PDF</h1>
        <p className="text-gray-500 mt-1">Upload notes, papers and PDFs to generate study content.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div
          onClick={() => fileRef.current.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          {file ? (
            <div>
              <p className="text-3xl mb-2">📎</p>
              <p className="text-blue-600 font-medium">{file.name}</p>
              <p className="text-gray-400 text-xs mt-1">Click to change file</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl mb-3">☁️</p>
              <p className="text-gray-700 font-medium">Click to select a PDF</p>
              <p className="text-gray-400 text-xs mt-1">Supports PDF files only</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setUploadDone(false);
            setDocumentId(null);
          }}
        />

        {error && (
          <div className="mt-3 text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-all"
        >
          {uploading ? "Uploading..." : uploadDone ? "✅ Uploaded — Re-upload" : "Upload PDF"}
        </button>
      </div>

      {uploadDone && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button
            onClick={handleSummary}
            disabled={loadingSummary}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all"
          >
            {loadingSummary ? "Generating..." : "📝 Summary"}
          </button>
          <button
            onClick={handleQuiz}
            disabled={loadingQuiz}
            className="bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all"
          >
            {loadingQuiz ? "Generating..." : "🧠 Quiz"}
          </button>
          <button
            onClick={handleFlashcards}
            disabled={loadingFlashcards}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all"
          >
            {loadingFlashcards ? "Generating..." : "🃏 Flashcards"}
          </button>
        </div>
      )}

      {summary && (
        <ResultCard title="📝 Summary">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{summary}</p>
        </ResultCard>
      )}

      {quiz.length > 0 && (
        <ResultCard title="🧠 Quiz">
          <QuizDisplay quiz={quiz} />
        </ResultCard>
      )}

      {flashcards.length > 0 && (
        <ResultCard title="🃏 Flashcards">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {flashcards.map((card, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-blue-600 text-sm font-bold mb-1">Q: {card.front}</p>
                <p className="text-gray-700 text-sm">A: {card.back}</p>
              </div>
            ))}
          </div>
        </ResultCard>
      )}
    </div>
  );
}

// ─── NOTES MODE ──────────────────────────────────────────────
function NotesMode({ onBack }) {
  const [notes, setNotes] = useState("");
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!notes.trim()) return setError("Please paste your notes.");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/notes/generate-from-text`,
        { text: notes, courseName },
        authHeader()
      );
      setResult(res.data.summary?.summary || res.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-6 text-sm font-medium"
      >
        ← Back to Generate
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📋 Paste Notes</h1>
        <p className="text-gray-500 mt-1">Type out or paste your notes to generate a summary.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <input
          type="text"
          placeholder="Course name (optional)"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          rows={10}
          placeholder="Paste your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {error && (
          <div className="text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-all"
        >
          {loading ? "Generating..." : "✨ Generate Summary"}
        </button>
      </div>

      {result && (
        <ResultCard title="📝 Summary">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{result}</p>
        </ResultCard>
      )}
    </div>
  );
}

// ─── TOPIC MODE ──────────────────────────────────────────────
function TopicMode({ onBack }) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return setError("Please enter a topic.");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/topics/learn`,
        { topic },
        authHeader()
      );
      const { topicData } = res.data;
      setResult({
        summary: topicData.summary,
        quiz: topicData.quiz,
        flashcards: topicData.flashcards,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-6 text-sm font-medium"
      >
        ← Back to Generate
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🎯 Learn a Subject</h1>
        <p className="text-gray-500 mt-1">Enter any topic and get a full study guide instantly.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <input
          type="text"
          placeholder="e.g. Operating System Scheduling Algorithms"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && (
          <div className="text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-all"
        >
          {loading ? "Generating..." : "🚀 Generate Learning Content"}
        </button>
      </div>

      {result && (
        <>
          {result.summary && (
            <ResultCard title="📝 Summary">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{result.summary}</p>
            </ResultCard>
          )}
          {result.quiz?.length > 0 && (
            <ResultCard title="🧠 Quiz">
              <QuizDisplay quiz={result.quiz} />
            </ResultCard>
          )}
          {result.flashcards?.length > 0 && (
            <ResultCard title="🃏 Flashcards">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.flashcards.map((card, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-blue-600 text-sm font-bold mb-1">Q: {card.front}</p>
                    <p className="text-gray-700 text-sm">A: {card.back}</p>
                  </div>
                ))}
              </div>
            </ResultCard>
          )}
        </>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────
export default function Generate() {
  const [selectedMode, setSelectedMode] = useState("");

  return (
    <Layout>
      <div>
        {selectedMode === "" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">✨ Generate</h1>
              <p className="text-gray-500 mt-1">Choose how you want to study today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { key: "pdf", icon: "📄", title: "Upload PDF", desc: "Upload notes, papers and PDFs.", color: "hover:border-blue-500" },
                { key: "notes", icon: "📋", title: "Paste Notes", desc: "Type out or paste your notes.", color: "hover:border-emerald-500" },
                { key: "topic", icon: "🎯", title: "Learn Topic", desc: "Enter a topic you want to study.", color: "hover:border-violet-500" },
              ].map((m) => (
                <div
                  key={m.key}
                  onClick={() => setSelectedMode(m.key)}
                  className={`bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent ${m.color} hover:shadow-xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3`}
                >
                  <div className="text-5xl">{m.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">{m.title}</h3>
                  <p className="text-gray-500 text-sm">{m.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedMode === "pdf" && <PdfMode onBack={() => setSelectedMode("")} />}
        {selectedMode === "notes" && <NotesMode onBack={() => setSelectedMode("")} />}
        {selectedMode === "topic" && <TopicMode onBack={() => setSelectedMode("")} />}
      </div>
    </Layout>
  );
}
