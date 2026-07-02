import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/3" };
    if (p.length < 10) return { label: "Medium", color: "bg-amber-400", width: "w-2/3" };
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  };

  const passwordStrength = strength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-20 translate-y-20" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
            📖
          </div>
          <span className="text-white font-bold text-xl">Learnova</span>
        </div>

        {/* Center */}
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Start Your<br />Learning Journey.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed mb-8">
            Join thousands of students who are studying smarter with AI-powered tools.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { step: "1", title: "Create your account", desc: "Free to get started" },
              { step: "2", title: "Upload your PDFs", desc: "Any study material works" },
              { step: "3", title: "Generate & Learn", desc: "AI creates summaries, quizzes and flashcards" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{s.title}</p>
                  <p className="text-indigo-300 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 border-t border-white/20 pt-6">
          <p className="text-indigo-200 text-sm italic">
            "An investment in knowledge pays the best interest."
          </p>
          <p className="text-white/60 text-xs mt-1">— Benjamin Franklin</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-xl">
              📖
            </div>
            <span className="font-bold text-xl text-gray-800">Learnova</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">Create account</h1>
            <p className="text-gray-400 mt-1">Join Learnova and start studying smarter today.</p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Juhi Chauhan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password strength */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`${passwordStrength.color} ${passwordStrength.width} h-1.5 rounded-full transition-all duration-300`} />
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    passwordStrength.label === "Weak" ? "text-red-500"
                    : passwordStrength.label === "Medium" ? "text-amber-500"
                    : "text-emerald-500"
                  }`}>
                    {passwordStrength.label} password
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.01] shadow-lg shadow-indigo-200 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
            to="/login"
             className="text-indigo-600 font-semibold hover:underline"
              >
             Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-400">
            By creating an account you agree to our{" "}
            <span className="text-indigo-500 cursor-pointer hover:underline">Terms</span>{" "}
            and{" "}
            <span className="text-indigo-500 cursor-pointer hover:underline">Privacy Policy</span>
          </p>

        </div>
      </div>
    </div>
  );
}