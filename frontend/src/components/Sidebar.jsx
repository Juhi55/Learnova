import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogout, setShowLogout] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/generate", icon: "⚡", label: "Generate" },
    { to: "/library", icon: "📚", label: "Library" },
    { to: "/chat", icon: "🤖", label: "AI Tutor" },
    { to: "/practice", icon: "🎯", label: "Practice" },
    { to: "/leaderboard", icon: "🏆", label: "Leaderboard" },
  ];

  return (
   <div
  className={`
    bg-[#0f1117] text-white fixed
    h-screen w-64 transition-all duration-300
    z-50 flex flex-col
    ${isOpen ? "left-0" : "-left-64"} md:left-0
  `}
>
      {/* Logo */}
      <Link
  to="/"
  className="p-6 flex items-center gap-3 hover:bg-white/5 transition rounded-xl mx-2"
>
  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">
    📖
  </div>

  <div>
    <h1 className="text-lg font-bold text-white">
      Learnova
    </h1>

    <p className="text-xs text-gray-300">
      Your AI Learning Companion
    </p>
  </div>
</Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Promo Card */}
      <div className="mx-3 mb-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4">
        <p className="text-white font-bold text-sm">Keep Learning,</p>
        <p className="text-white font-bold text-sm">Keep Growing!</p>
        <p className="text-indigo-200 text-xs mt-1">Your journey to mastery starts today.</p>
        <div className="mt-2 text-2xl">🚀</div>
      </div>

      {/* User Profile */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={() => setShowLogout(!showLogout)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition"
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 text-left">
            <p className="text-white text-sm font-semibold truncate">{user?.name || "User"}</p>
            <p className="text-gray-500 text-xs">Student</p>
          </div>
          <span className="text-gray-500 text-xs">{showLogout ? "▲" : "▼"}</span>
        </button>

        {showLogout && (
          <button
            onClick={logout}
            className="w-full mt-1 text-left px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 text-sm font-medium transition"
          >
            🚪 Logout
          </button>
        )}
      </div>
    </div>
  );
}