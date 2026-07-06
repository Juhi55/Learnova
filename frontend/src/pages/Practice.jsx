import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "https://learnova-backend-9yuu.onrender.com/api";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const COURSES = [
  { id: "math", icon: "📐", title: "Mathematics", description: "Algebra, Calculus, Geometry & more", color: "hover:border-blue-400 hover:bg-blue-50" },
  { id: "physics", icon: "⚡", title: "Physics", description: "Mechanics, Electricity, Optics & more", color: "hover:border-yellow-400 hover:bg-yellow-50" },
  { id: "chemistry", icon: "🧪", title: "Chemistry", description: "Organic, Inorganic, Physical Chemistry", color: "hover:border-green-400 hover:bg-green-50" },
  { id: "biology", icon: "🧬", title: "Biology", description: "Cells, Genetics, Ecology & more", color: "hover:border-emerald-400 hover:bg-emerald-50" },
  { id: "history", icon: "🏛️", title: "History", description: "World History, Civilizations & Events", color: "hover:border-orange-400 hover:bg-orange-50" },
  { id: "geography", icon: "🌍", title: "Geography", description: "Countries, Capitals, Maps & more", color: "hover:border-teal-400 hover:bg-teal-50" },
  { id: "computer_science", icon: "💻", title: "Computer Science", description: "Programming, Algorithms, Data Structures", color: "hover:border-violet-400 hover:bg-violet-50" },
  { id: "economics", icon: "📈", title: "Economics", description: "Micro, Macro, Finance & Markets", color: "hover:border-pink-400 hover:bg-pink-50" },
  { id: "english", icon: "📖", title: "English", description: "Grammar, Vocabulary, Literature", color: "hover:border-red-400 hover:bg-red-50" },
  { id: "psychology", icon: "🧠", title: "Psychology", description: "Behavior, Cognition, Mental Health", color: "hover:border-purple-400 hover:bg-purple-50" },
  { id: "political_science", icon: "🏛", title: "Political Science", description: "Governance, Policies & International Relations", color: "hover:border-indigo-400 hover:bg-indigo-50" },
  { id: "philosophy", icon: "🤔", title: "Philosophy", description: "Ethics, Logic, Metaphysics & more", color: "hover:border-amber-400 hover:bg-amber-50" },
];

// ─── QUIZ PLAYER ─────────────────────────────────────────────
function QuizPlayer({ quiz, course, onReset }) {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const labels = ["A", "B", "C", "D"];

  const handleSelect = (qi, oi) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qi]: oi }));
  };

  const correctIndex = (q) =>
    q.options.findIndex((opt) => opt.trim() === q.answer.trim());

  const score = Object.keys(selected).filter((i) => {
    const q = quiz[i];
    return q.options[selected[i]]?.trim() === q.answer.trim();
  }).length;

  const allAnswered = Object.keys(selected).length === quiz.length;

  const getOptionClass = (q, qi, oi) => {
    const isCorrect = q.options[oi].trim() === q.answer.trim();
    const isSelected = selected[qi] === oi;

    if (!submitted) {
      return isSelected
        ? "border-blue-500 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer";
    }
    if (isCorrect) return "border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold";
    if (isSelected && !isCorrect) return "border-red-400 bg-red-50 text-red-600 font-semibold";
    return "border-gray-100 bg-gray-50 text-gray-400 opacity-50";
  };

  return (
    <div>
      {/* Quiz header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{course.icon}</span>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>
            <p className="text-gray-400 text-xs">{quiz.length} questions</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition"
        >
          ← Back
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{Object.keys(selected).length} of {quiz.length} answered</span>
          {submitted && (
            <span className={`font-bold ${score >= quiz.length * 0.7 ? "text-emerald-600" : "text-red-500"}`}>
              Score: {score}/{quiz.length}
            </span>
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(selected).length / quiz.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {quiz.map((q, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0">
                Q{i + 1}
              </span>
              <p className="text-gray-800 font-medium text-sm leading-relaxed">{q.question}</p>
            </div>
            <ul className="space-y-2">
              {q.options.map((opt, j) => (
                <li
                  key={j}
                  onClick={() => handleSelect(i, j)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm ${getOptionClass(q, i, j)}`}
                >
                  <span className="font-bold w-5 flex-shrink-0 text-gray-400">{labels[j]}.</span>
                  <span className="flex-1">{opt}</span>
                  {submitted && q.options[j].trim() === q.answer.trim() && <span>✅</span>}
                  {submitted && selected[i] === j && q.options[j].trim() !== q.answer.trim() && <span>❌</span>}
                </li>
              ))}
            </ul>

            {submitted && selected[i] !== undefined &&
              q.options[selected[i]]?.trim() !== q.answer.trim() && (
                <p className="mt-3 text-xs text-emerald-600 font-medium bg-emerald-50 px-3 py-2 rounded-lg">
                  ✅ Correct: <span className="font-bold">{labels[correctIndex(q)]}. {q.answer}</span>
                </p>
              )}
            {submitted && selected[i] === undefined && (
              <p className="mt-3 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                ⏭ Skipped — Correct: <span className="font-bold">{labels[correctIndex(q)]}. {q.answer}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold transition-all"
        >
          {allAnswered
            ? "Submit Quiz"
            : `Answer all questions (${quiz.length - Object.keys(selected).length} remaining)`}
        </button>
      ) : (
        <div className={`mt-6 rounded-2xl p-6 text-center border-2 ${
          score === quiz.length ? "bg-emerald-50 border-emerald-300"
          : score >= quiz.length * 0.7 ? "bg-blue-50 border-blue-300"
          : "bg-red-50 border-red-300"
        }`}>
          <p className="text-4xl mb-2">
            {score === quiz.length ? "🎉" : score >= quiz.length * 0.7 ? "👍" : "📚"}
          </p>
          <p className={`text-2xl font-bold ${
            score === quiz.length ? "text-emerald-700"
            : score >= quiz.length * 0.7 ? "text-blue-700"
            : "text-red-600"
          }`}>
            {score === quiz.length ? "Perfect Score!"
            : score >= quiz.length * 0.7 ? "Good Job!"
            : "Keep Studying!"}
          </p>
          <p className="text-gray-600 mt-1">
            You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{quiz.length}</span>
          </p>
          <div className="flex gap-3 mt-5 justify-center">
            <button
              onClick={() => { setSelected({}); setSubmitted(false); }}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
            >
              🔄 Retry
            </button>
            <button
              onClick={onReset}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
            >
              📚 All Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────
export default function Practice() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const filtered = COURSES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    setError("");
    setLoading(true);
    setQuiz(null);
    try {
      const res = await axios.post(
        `${API}/topics/learn`,
        { topic: course.title },
        authHeader()
      );
      const { topicData } = res.data;
      setQuiz(topicData.quiz);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate quiz.");
      setSelectedCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setSelectedCourse(null);
    setError("");
    setSearch("");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📝 Practice</h1>
          <p className="text-gray-500 mt-1">Select a course and test your knowledge with AI-generated quizzes.</p>
        </div>

        {/* Loading screen */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <p className="text-5xl mb-4 animate-bounce">{selectedCourse?.icon}</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Generating Quiz...</h2>
            <p className="text-gray-500 text-sm">Creating 10 questions on <span className="font-semibold">{selectedCourse?.title}</span></p>
            <div className="mt-6 w-48 mx-auto bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {/* Course grid */}
        {!loading && !quiz && (
          <>
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              />
            </div>

            {error && (
              <div className="text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm mb-4">
                ⚠️ {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`bg-white rounded-2xl shadow-sm border-2 border-transparent p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${course.color}`}
                >
                  <div className="text-4xl mb-3">{course.icon}</div>
                  <h3 className="text-gray-800 font-bold text-base mb-1">{course.title}</h3>
                  <p className="text-gray-500 text-xs">{course.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-blue-500 text-xs font-semibold">
                    Start Quiz <span>→</span>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-10 text-gray-400">
                  No courses found for "{search}"
                </div>
              )}
            </div>
          </>
        )}

        {/* Quiz */}
        {!loading && quiz && (
          <QuizPlayer quiz={quiz} course={selectedCourse} onReset={handleReset} />
        )}

      </div>
    </Layout>
  );
}
