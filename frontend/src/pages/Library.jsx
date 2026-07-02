import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

export default function Library() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchLibrary(); }, []);

  const fetchLibrary = async () => {
    try {
      const res = await api.get("/library");
      setLibrary(res.data.library);
    } catch (error) {
      console.error("Library Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = library.filter((item) =>
    item.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const getBadges = (item) => {
    const badges = [];
    if (item.summaryExists) badges.push({ label: "Summary", icon: "📝", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" });
    if (item.quizExists) badges.push({ label: "Quiz", icon: "🧠", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" });
    if (item.flashcardExists) badges.push({ label: "Flashcards", icon: "🃏", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" });
    return badges;
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📚 My Library</h1>
            <p className="text-gray-400 text-sm mt-1">All your study materials in one place</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold px-4 py-2 rounded-xl">
            {library.length} Documents
          </div>
        </div>

        {/* Search */}
        {!loading && library.length > 0 && (
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search your documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-20" />
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && library.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <p className="text-5xl mb-4">📂</p>
            <h2 className="text-gray-800 font-bold text-xl mb-2">Your library is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Upload a PDF and generate summaries, quizzes or flashcards to see them here.</p>
            <button
              onClick={() => navigate("/generate")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
            >
              + Upload your first PDF
            </button>
          </div>
        )}

        {/* No search results */}
        {!loading && library.length > 0 && filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-gray-500 font-medium">No documents found for &quot;{search}&quot;</p>
          </div>
        )}

        {/* Library Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => {
              const badges = getBadges(item);
              return (
                <div
                  key={item.documentId}
                  onClick={() => navigate(`/library/${item.documentId}`)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  {/* File icon + name */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-gray-800 font-bold text-base truncate">{item.fileName}</h2>
                      <p className="text-gray-400 text-xs mt-0.5">Click to view all content</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-indigo-500 text-lg transition-colors">→</span>
                  </div>

                  {/* Badges */}
                  {badges.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {badges.map((b, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 ${b.bg} ${b.text} border ${b.border} px-3 py-1 rounded-full text-xs font-semibold`}
                        >
                          {b.icon} {b.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300 text-xs">No content generated yet</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </Layout>
  );
}