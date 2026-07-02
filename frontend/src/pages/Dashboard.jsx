import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const QUOTES = [
  "The beautiful thing about learning is that no one can take it away from you.",
  "Education is the passport to the future.",
  "The more that you read, the more things you will know.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "An investment in knowledge pays the best interest.",
];

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
    documents: 0,
    summaries: 0,
    quizzes: 0,
    flashcards: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docs, summaries, quizzes, flashcards] = await Promise.all([
          axios.get(`${API}/documents`, authHeader()),
          axios.get(`${API}/summaries`, authHeader()),
          axios.get(`${API}/quizzes`, authHeader()),
          axios.get(`${API}/flashcards`, authHeader()),
        ]);

        const docList = docs.data.documents || [];
        const summaryList = summaries.data.summaries || [];
        const quizList = quizzes.data.quizzes || [];
        const flashcardList = flashcards.data.flashcards || [];

        setStats({
          documents: docList.length,
          summaries: summaryList.length,
          quizzes: quizList.length,
          flashcards: flashcardList.length,
        });

        // Build recent activity from all items
        const activity = [
          ...docList.slice(0, 2).map((d) => ({
            icon: "📄",
            color: "bg-red-100",
            title: d.fileName,
            action: "Document uploaded",
            time: d.createdAt,
          })),
          ...summaryList.slice(0, 2).map((s) => ({
            icon: "📝",
            color: "bg-blue-100",
            title: s.documentId?.fileName || "Summary",
            action: "Summary generated",
            time: s.createdAt,
          })),
          ...quizList.slice(0, 2).map((q) => ({
            icon: "🧠",
            color: "bg-violet-100",
            title: q.documentId?.fileName || "Quiz",
            action: "Quiz generated",
            time: q.createdAt,
          })),
          ...flashcardList.slice(0, 2).map((f) => ({
            icon: "🃏",
            color: "bg-amber-100",
            title: f.documentId?.fileName || "Flashcards",
            action: "Flashcards created",
            time: f.createdAt,
          })),
        ]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);

        setRecentActivity(activity);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchStats();
  }, []);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const statCards = [
    { icon: "📄", label: "Documents Uploaded", value: stats.documents, color: "text-blue-500", bg: "bg-blue-50" },
    { icon: "📝", label: "Summaries Generated", value: stats.summaries, color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: "🧠", label: "Quizzes Generated", value: stats.quizzes, color: "text-violet-500", bg: "bg-violet-50" },
    { icon: "🃏", label: "Flashcards Created", value: stats.flashcards, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top heading */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}! 👋</p>
        </div>

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 rounded-3xl p-8 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/30 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 right-20 w-40 h-40 bg-purple-200/30 rounded-full translate-y-10" />

          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-1">
              Hello, {user?.name}! 👋
            </h2>
            <p className="text-gray-500 mb-6">Ready to continue your learning journey?</p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-indigo-200"
            >
              + Upload PDF
            </Link>
          </div>

          {/* Right illustration */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-3">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg rotate-6">
              🤖
            </div>
            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg -rotate-6 mt-8">
              📄
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-xl shadow-lg rotate-3 -mt-6">
              💬
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition">
              <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs leading-tight mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row — Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-base">Recent Activity</h3>
              <Link to="/documents" className="text-indigo-500 text-xs font-semibold hover:underline">
                View all
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📂</p>
                <p className="text-gray-400 text-sm">No activity yet. Start by uploading a PDF!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center text-base flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-medium truncate">{item.title}</p>
                      <p className="text-gray-400 text-xs">{item.action}</p>
                    </div>
                    <span className="text-emerald-500 text-xs font-semibold flex-shrink-0">
                      {timeAgo(item.time)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 text-base mb-5">Quick Actions ⚡</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: "/generate", icon: "📄", label: "Upload PDF", color: "bg-blue-50 hover:bg-blue-100 text-blue-600" },
                { to: "/generate", icon: "📝", label: "Generate Summary", color: "bg-emerald-50 hover:bg-emerald-100 text-emerald-600" },
                { to: "/practice", icon: "🧠", label: "Practice Quiz", color: "bg-violet-50 hover:bg-violet-100 text-violet-600" },
                { to: "/generate", icon: "🃏", label: "Flashcards", color: "bg-amber-50 hover:bg-amber-100 text-amber-600" },
              ].map((a, i) => (
                <Link
                  key={i}
                  to={a.to}
                  className={`${a.color} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 text-center`}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-semibold">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quote Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 flex items-center gap-6 border border-indigo-100">
          <div className="text-5xl text-indigo-300 font-serif leading-none flex-shrink-0">"</div>
          <div className="flex-1">
            <p className="text-gray-700 font-medium italic text-sm leading-relaxed">{quote}</p>
          </div>
          <div className="hidden md:block text-4xl flex-shrink-0">🎓</div>
        </div>

      </div>
    </Layout>
  );
}