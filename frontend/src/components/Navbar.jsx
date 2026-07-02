import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const API = "http://localhost:5000/api";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default function Navbar({ toggleSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const { theme, setTheme } = useTheme();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef();

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef();

  const [showTheme, setShowTheme] = useState(false);
  const themeRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (themeRef.current && !themeRef.current.contains(e.target)) setShowTheme(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const [docs, summaries, quizzes, flashcards] = await Promise.all([
        axios.get(`${API}/documents`, authHeader()),
        axios.get(`${API}/summaries`, authHeader()),
        axios.get(`${API}/quizzes`, authHeader()),
        axios.get(`${API}/flashcards`, authHeader()),
      ]);

      const items = [
        ...(docs.data.documents || []).map((d) => ({
          icon: "📄", color: "bg-blue-100",
          text: `Document uploaded: ${d.fileName}`,
          time: d.createdAt, read: false,
        })),
        ...(summaries.data.summaries || []).map((s) => ({
          icon: "📝", color: "bg-emerald-100",
          text: `Summary generated for ${s.documentId?.fileName || "a document"}`,
          time: s.createdAt, read: false,
        })),
        ...(quizzes.data.quizzes || []).map((q) => ({
          icon: "🧠", color: "bg-violet-100",
          text: `Quiz generated for ${q.documentId?.fileName || "a document"}`,
          time: q.createdAt, read: false,
        })),
        ...(flashcards.data.flashcards || []).map((f) => ({
          icon: "🃏", color: "bg-amber-100",
          text: `Flashcards created for ${f.documentId?.fileName || "a document"}`,
          time: f.createdAt, read: false,
        })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8);

      setNotifications(items);
      setUnread(items.length);
    } catch (err) {
      console.error("Notifications fetch error:", err);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnread(0);
    setShowNotifs(false);
  };

  const markAllRead = () => {
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); setShowSearch(false); return; }
    const delay = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(delay);
  }, [query]);

  const doSearch = async (q) => {
    setSearching(true);
    try {
      const [docs, summaries, quizzes, flashcards] = await Promise.all([
        axios.get(`${API}/documents`, authHeader()),
        axios.get(`${API}/summaries`, authHeader()),
        axios.get(`${API}/quizzes`, authHeader()),
        axios.get(`${API}/flashcards`, authHeader()),
      ]);
      const lower = q.toLowerCase();
      const results = [];
      (docs.data.documents || []).forEach((d) => {
        if (d.fileName.toLowerCase().includes(lower))
          results.push({ icon: "📄", label: d.fileName, sub: "Document", to: "/documents" });
      });
      (summaries.data.summaries || []).forEach((s) => {
        const name = s.documentId?.fileName || "";
        if (name.toLowerCase().includes(lower))
          results.push({ icon: "📝", label: `Summary — ${name}`, sub: "Summary", to: "/summaries" });
      });
      (quizzes.data.quizzes || []).forEach((q2) => {
        const name = q2.documentId?.fileName || "";
        if (name.toLowerCase().includes(lower))
          results.push({ icon: "🧠", label: `Quiz — ${name}`, sub: "Quiz", to: "/quizzes" });
      });
      (flashcards.data.flashcards || []).forEach((f) => {
        const name = f.documentId?.fileName || "";
        if (name.toLowerCase().includes(lower))
          results.push({ icon: "🃏", label: `Flashcards — ${name}`, sub: "Flashcard", to: "/flashcards" });
      });
      setSearchResults(results.slice(0, 6));
      setShowSearch(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-16 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm transition-colors duration-200">

      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-600 dark:text-gray-200 hover:bg-gray-100 p-2 rounded-lg transition"
      >
        ☰
      </button>

      {/* Search */}
      <div className="flex flex-1 max-w-md mx-4 relative" ref={searchRef}>
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && setShowSearch(true)}
            className="w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          {searching && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
              Searching...
            </span>
          )}
        </div>

        {showSearch && (
          <div className="absolute top-12 left-0 right-0 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">
            {searchResults.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                No results for &quot;{query}&quot;
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-400 px-4 pt-3 pb-1 font-semibold uppercase tracking-wide">
                  Results
                </p>
                {searchResults.map((r, i) => (
                  <Link
                    key={i}
                    to={r.to}
                    onClick={() => { setShowSearch(false); setQuery(""); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                  >
                    <span className="text-lg">{r.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.label}</p>
                      <p className="text-xs text-gray-400">{r.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">

        {/* Theme Toggle */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setShowTheme(!showTheme)}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition text-lg"
            title="Change theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {showTheme && (
            <div className="absolute right-0 top-12 w-36 bg-white dark:bg-[#1a1d2e] border border-gray-100 dark:border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => { setTheme("light"); setShowTheme(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition ${
                  theme === "light" ? "text-indigo-600 font-semibold" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>☀️</span>
                <span>Light</span>
                {theme === "light" && <span className="ml-auto">✓</span>}
              </button>
              <button
                onClick={() => { setTheme("dark"); setShowTheme(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition ${
                  theme === "dark" ? "text-indigo-600 font-semibold" : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <span>🌙</span>
                <span>Dark</span>
                {theme === "dark" && <span className="ml-auto">✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifs(!showNotifs); markAllRead(); }}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition"
          >
            <span className="text-lg">🔔</span>
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1a1d2e] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/10">
                <p className="font-bold text-gray-800 dark:text-white text-sm">Notifications</p>
                <button
                  onClick={clearNotifications}
                  className="text-xs text-indigo-500 hover:underline font-medium"
                >
                  Clear all
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  <p className="text-2xl mb-2">🔔</p>
                  No notifications yet
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition ${
                        !n.read ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                      }`}
                    >
                      <div className={`w-8 h-8 ${n.color} rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5`}>
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.time)}</p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400">Student</p>
          </div>
        </div>

      </div>
    </div>
  );
}