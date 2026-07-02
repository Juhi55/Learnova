import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 10000,  suffix: "+", label: "Active students" },
  { value: 50000,  suffix: "+", label: "PDFs processed" },
  { value: 200000, suffix: "+", label: "Quizzes generated" },
  { value: 99,     suffix: "%", label: "Satisfaction rate" },
];

const FEATURES = [
  { icon: "📄", bg: "rgba(99,102,241,0.12)",  name: "Upload any PDF",   desc: "Drop in notes, textbooks, or research papers. AI reads and understands everything instantly." },
  { icon: "📝", bg: "rgba(16,185,129,0.12)",  name: "AI summaries",     desc: "Get concise, well-structured summaries of any document in seconds. Study smarter, not harder." },
  { icon: "🧠", bg: "rgba(168,85,247,0.12)",  name: "Smart quizzes",    desc: "Auto-generated MCQ quizzes from your content. Test yourself and track your progress." },
  { icon: "🃏", bg: "rgba(245,158,11,0.12)",  name: "Flashcards",       desc: "Spaced repetition flashcards built from your material. Perfect for focused exam prep." },
  { icon: "🤖", bg: "rgba(236,72,153,0.12)",  name: "AI tutor",         desc: "Ask questions, get explanations, explore topics. Your personal AI tutor available 24/7." },
  { icon: "🎯", bg: "rgba(6,182,212,0.12)",   name: "Practice mode",    desc: "Choose from 12+ subjects and practice with AI-generated quizzes anytime, anywhere." },
];

const STEPS = [
  { num: "01", icon: "📤", name: "Upload your PDF",  desc: "Drag and drop any study material — notes, papers, or full textbooks." },
  { num: "02", icon: "⚡", name: "AI processes it",  desc: "Our AI reads, understands, and extracts key knowledge instantly." },
  { num: "03", icon: "🎓", name: "Study smarter",    desc: "Use summaries, quizzes, and flashcards to master the material." },
];

const TESTIMONIALS = [
  { avatar: "P", grad: "linear-gradient(135deg,#ec4899,#f43f5e)", name: "Priya Sharma",  role: "Medical student",     text: "Learnova turned my 200-page anatomy textbook into a quiz in minutes. My exam scores improved by 30%!" },
  { avatar: "A", grad: "linear-gradient(135deg,#6366f1,#3b82f6)", name: "Arjun Mehta",   role: "Engineering student", text: "The AI Tutor is incredible. It explains complex algorithms like a real teacher would. I use it every day." },
  { avatar: "S", grad: "linear-gradient(135deg,#10b981,#059669)", name: "Sneha Patel",   role: "Law student",         text: "Flashcards from my case study PDFs saved me weeks of manual work. This is the future of studying." },
];

// ─── Study background items ──────────────────────────────────────────────────
// Each item: { text, x (%), y (%), size, opacity, rotate, color, type }
// type: "formula" | "word" | "greek" | "diagram"
const BG_ITEMS = [
  // Math / Physics formulas
  { text: "E = mc²",         x: 4,   y: 8,   size: 18, op: 0.18, rot: -12, col: "#818cf8", type: "formula" },
  { text: "F = ma",          x: 88,  y: 5,   size: 16, op: 0.15, rot: 8,   col: "#a78bfa", type: "formula" },
  { text: "∑F = 0",          x: 14,  y: 22,  size: 14, op: 0.14, rot: 5,   col: "#6366f1", type: "formula" },
  { text: "PV = nRT",        x: 78,  y: 18,  size: 15, op: 0.16, rot: -7,  col: "#818cf8", type: "formula" },
  { text: "∫₀∞ e⁻ˣ dx = 1", x: 6,   y: 40,  size: 13, op: 0.13, rot: 3,   col: "#a78bfa", type: "formula" },
  { text: "a² + b² = c²",   x: 82,  y: 35,  size: 15, op: 0.15, rot: -5,  col: "#818cf8", type: "formula" },
  { text: "v = u + at",      x: 20,  y: 55,  size: 14, op: 0.14, rot: 8,   col: "#6366f1", type: "formula" },
  { text: "λ = h / mv",      x: 70,  y: 52,  size: 13, op: 0.13, rot: -10, col: "#c084fc", type: "formula" },
  { text: "sin²θ + cos²θ = 1", x: 3, y: 68,  size: 13, op: 0.12, rot: 6,   col: "#818cf8", type: "formula" },
  { text: "∇²ψ = 0",        x: 88,  y: 62,  size: 15, op: 0.14, rot: -8,  col: "#a78bfa", type: "formula" },
  { text: "pH = −log[H⁺]",  x: 35,  y: 78,  size: 13, op: 0.13, rot: 4,   col: "#6366f1", type: "formula" },
  { text: "KE = ½mv²",      x: 60,  y: 82,  size: 14, op: 0.14, rot: -6,  col: "#818cf8", type: "formula" },
  { text: "P = IV",          x: 8,   y: 88,  size: 16, op: 0.15, rot: 9,   col: "#a78bfa", type: "formula" },
  { text: "Δ G = ΔH − TΔS", x: 75,  y: 88,  size: 13, op: 0.12, rot: -4,  col: "#c084fc", type: "formula" },
  { text: "d/dx(sin x) = cos x", x: 44, y: 10, size: 12, op: 0.12, rot: 3, col: "#818cf8", type: "formula" },
  { text: "lim x→0 (sin x/x) = 1", x: 50, y: 65, size: 11, op: 0.11, rot: -5, col: "#6366f1", type: "formula" },

  // Greek / math symbols
  { text: "∑", x: 30,  y: 15,  size: 32, op: 0.1,  rot: 0,  col: "#818cf8", type: "greek" },
  { text: "∫", x: 92,  y: 28,  size: 30, op: 0.09, rot: 0,  col: "#a78bfa", type: "greek" },
  { text: "∞", x: 48,  y: 42,  size: 28, op: 0.09, rot: 0,  col: "#6366f1", type: "greek" },
  { text: "π", x: 1,   y: 52,  size: 30, op: 0.1,  rot: 0,  col: "#818cf8", type: "greek" },
  { text: "Δ", x: 55,  y: 28,  size: 26, op: 0.09, rot: 0,  col: "#c084fc", type: "greek" },
  { text: "∂", x: 16,  y: 73,  size: 28, op: 0.09, rot: 0,  col: "#a78bfa", type: "greek" },
  { text: "√", x: 85,  y: 75,  size: 28, op: 0.1,  rot: 0,  col: "#818cf8", type: "greek" },
  { text: "θ", x: 40,  y: 88,  size: 24, op: 0.09, rot: 0,  col: "#6366f1", type: "greek" },
  { text: "λ", x: 93,  y: 45,  size: 26, op: 0.09, rot: 0,  col: "#c084fc", type: "greek" },
  { text: "Ω", x: 22,  y: 36,  size: 24, op: 0.09, rot: 0,  col: "#818cf8", type: "greek" },
  { text: "∇", x: 68,  y: 8,   size: 26, op: 0.09, rot: 0,  col: "#a78bfa", type: "greek" },
  { text: "μ", x: 57,  y: 95,  size: 22, op: 0.09, rot: 0,  col: "#6366f1", type: "greek" },

  // Study words
  { text: "BIOLOGY",    x: 5,  y: 32,  size: 11, op: 0.08, rot: -90, col: "#34d399", type: "word" },
  { text: "CHEMISTRY",  x: 96, y: 55,  size: 11, op: 0.08, rot: 90,  col: "#f472b6", type: "word" },
  { text: "PHYSICS",    x: 5,  y: 60,  size: 11, op: 0.08, rot: -90, col: "#60a5fa", type: "word" },
  { text: "CALCULUS",   x: 96, y: 25,  size: 11, op: 0.08, rot: 90,  col: "#fbbf24", type: "word" },
  { text: "HISTORY",    x: 5,  y: 80,  size: 11, op: 0.08, rot: -90, col: "#a78bfa", type: "word" },
  { text: "ECONOMICS",  x: 96, y: 80,  size: 10, op: 0.08, rot: 90,  col: "#34d399", type: "word" },

  // Chemistry
  { text: "H₂O",       x: 25, y: 92,  size: 16, op: 0.14, rot: -5,  col: "#60a5fa", type: "formula" },
  { text: "CO₂",       x: 72, y: 92,  size: 16, op: 0.14, rot: 5,   col: "#34d399", type: "formula" },
  { text: "NaCl",      x: 46, y: 20,  size: 15, op: 0.13, rot: -3,  col: "#fbbf24", type: "formula" },
  { text: "C₆H₁₂O₆",  x: 15, y: 46,  size: 13, op: 0.12, rot: 7,   col: "#f472b6", type: "formula" },
  { text: "ATP → ADP", x: 62, y: 72,  size: 12, op: 0.12, rot: -4,  col: "#34d399", type: "formula" },

  // Programming / CS
  { text: "O(n log n)", x: 30, y: 4,   size: 13, op: 0.13, rot: 2,   col: "#60a5fa", type: "formula" },
  { text: "if (x > 0)", x: 62, y: 48,  size: 12, op: 0.11, rot: -3,  col: "#a78bfa", type: "formula" },
  { text: "∀x ∈ ℝ",    x: 80, y: 42,  size: 13, op: 0.12, rot: 6,   col: "#818cf8", type: "formula" },

  // Notebook-style short phrases
  { text: "Ch. 4 Notes",     x: 38, y: 57,  size: 11, op: 0.09, rot: -8,  col: "#fbbf24", type: "word" },
  { text: "Quiz tomorrow!",  x: 18, y: 97,  size: 11, op: 0.09, rot: 3,   col: "#f472b6", type: "word" },
  { text: "Review: Thermodynamics", x: 50, y: 2, size: 11, op: 0.09, rot: 0, col: "#60a5fa", type: "word" },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.5);
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const steps = 55;
    const inc = value / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, value);
      setCount(Math.floor(cur));
      if (cur >= value) clearInterval(t);
    }, 1800 / steps);
    return () => clearInterval(t);
  }, [visible, value]);
  return <span ref={ref}>{count >= 1000 ? count.toLocaleString() : count}{suffix}</span>;
}

// ─── Study Background ────────────────────────────────────────────────────────

function StudyBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Ruled notebook lines — very faint */}
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={`line-${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${(i + 1) * 3.3}%`,
            height: 1,
            background: "rgba(99,102,241,0.04)",
          }}
        />
      ))}

      {/* Left margin line */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0,
        left: "6%",
        width: 1,
        background: "rgba(239,68,68,0.06)",
      }} />

      {/* Dot grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.07) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }} />

      {/* Study content items */}
      {BG_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: item.size,
            fontWeight: item.type === "greek" ? 900 : item.type === "word" ? 800 : 700,
            fontFamily: item.type === "greek" || item.type === "formula"
              ? "'Georgia', 'Times New Roman', serif"
              : "'Inter', sans-serif",
            color: item.col,
            opacity: item.op,
            transform: `rotate(${item.rot}deg)`,
            whiteSpace: "nowrap",
            letterSpacing: item.type === "word" ? "0.15em" : "0.02em",
            userSelect: "none",
            animation: `bgFloat ${12 + (i % 7) * 2}s ${(i % 5) * -3}s ease-in-out infinite`,
          }}
        >
          {item.text}
        </div>
      ))}

      {/* Floating pencil / book doodle outlines — SVG */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pencil top-left */}
        <g transform="translate(50,120) rotate(-30)" stroke="#818cf8" strokeWidth="1.5" fill="none">
          <rect x="0" y="0" width="12" height="60" rx="2" />
          <polygon points="0,60 12,60 6,76" />
          <line x1="0" y1="8" x2="12" y2="8" />
        </g>
        {/* Pencil bottom-right */}
        <g transform="translate(92%,80%) rotate(20)" stroke="#a78bfa" strokeWidth="1.5" fill="none"
          style={{ transform: "translate(88%,75%) rotate(20deg)" }}>
          <rect x="0" y="0" width="12" height="60" rx="2" />
          <polygon points="0,60 12,60 6,76" />
          <line x1="0" y1="8" x2="12" y2="8" />
        </g>
        {/* Open book mid-left */}
        <g transform="translate(30,55%)" stroke="#6366f1" strokeWidth="1.2" fill="none"
          style={{ transform: "translate(2%,55%)" }}>
          <path d="M0,0 Q20,-10 40,0 Q20,10 0,0Z" />
          <path d="M40,0 Q60,-10 80,0 Q60,10 40,0Z" />
          <line x1="40" y1="-10" x2="40" y2="10" />
        </g>
        {/* Atom diagram top-right */}
        <g style={{ transform: "translate(88%,12%)" }} stroke="#c084fc" strokeWidth="1" fill="none">
          <circle cx="0" cy="0" r="6" />
          <ellipse cx="0" cy="0" rx="20" ry="8" />
          <ellipse cx="0" cy="0" rx="20" ry="8" transform="rotate(60 0 0)" />
          <ellipse cx="0" cy="0" rx="20" ry="8" transform="rotate(120 0 0)" />
        </g>
        {/* DNA helix hint bottom-left */}
        <g style={{ transform: "translate(3%,82%)" }} stroke="#34d399" strokeWidth="1" fill="none" opacity="0.7">
          <path d="M0,0 Q15,-15 30,0 Q15,15 0,30 Q15,15 30,30" />
          <path d="M30,0 Q15,-15 0,0 Q15,15 30,30 Q15,15 0,30" />
          <line x1="8" y1="-5" x2="22" y2="-5" strokeWidth="0.8" />
          <line x1="4" y1="10" x2="26" y2="10" strokeWidth="0.8" />
          <line x1="4" y1="20" x2="26" y2="20" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Landing() {
    const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeTest, setActiveTest] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTest(p => (p + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", background: "#0a0a1a", color: "#fff", overflowX: "hidden", minHeight: "100vh" }}>

      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes bgFloat {
          0%,100%{transform:translateY(0) rotate(var(--rot,0deg));}
          50%{transform:translateY(-12px) rotate(var(--rot,0deg));}
        }
        @keyframes pulse2 {
          0%,100%{opacity:1;transform:scale(1);}
          50%{opacity:.5;transform:scale(.8);}
        }
        @keyframes chipBounce {
          0%,100%{transform:translateY(0);}
          50%{transform:translateY(-6px);}
        }
        @keyframes spinSlow {
          from{transform:rotate(0deg);}
          to{transform:rotate(360deg);}
        }
        .nav-a{color:rgba(255,255,255,.65);text-decoration:none;font-size:14px;font-weight:500;transition:color .2s;}
        .nav-a:hover{color:#fff;}
        .feat-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:28px;transition:all .3s;}
        .feat-card:hover{border-color:rgba(99,102,241,.4);transform:translateY(-5px);}
        .step-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:32px 24px;text-align:center;transition:all .3s;}
        .step-card:hover{border-color:rgba(99,102,241,.3);transform:translateY(-4px);}
        .test-dot{height:8px;border-radius:4px;cursor:pointer;transition:all .3s;border:none;background:rgba(255,255,255,.2);}
        .test-dot.on{background:#6366f1;}
        .footer-a{font-size:12px;color:rgba(255,255,255,.35);cursor:pointer;transition:color .2s;}
        .footer-a:hover{color:rgba(255,255,255,.7);}
        .s-tag{display:inline-block;padding:5px 14px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;}
        .tag-i{background:rgba(99,102,241,.15);color:#818cf8;border:1px solid rgba(99,102,241,.3);}
        .tag-p{background:rgba(168,85,247,.15);color:#c084fc;border:1px solid rgba(168,85,247,.3);}
        .tag-g{background:rgba(16,185,129,.12);color:#34d399;border:1px solid rgba(16,185,129,.25);}
        .btn-gst:hover{border-color:rgba(255,255,255,.5)!important;color:#fff!important;}
        .btn-pry:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.5)!important;}
        .btn-hp:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,.55)!important;}
        .btn-hg:hover{background:rgba(255,255,255,.12)!important;color:#fff!important;}
        .prev-line{height:4px;border-radius:4px;background:rgba(255,255,255,.1);margin-bottom:5px;}
      `}</style>

      {/* ── Study background ── */}
      <StudyBackground />

      {/* ── NAVBAR ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 40px",height:64,
        background: scrolled ? "rgba(10,10,26,.95)" : "rgba(10,10,26,.7)",
        backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(129,140,248,.12)",
        transition:"background .3s",
      }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,fontSize:20,fontWeight:800,color:"#fff",letterSpacing:"-0.5px" }}>
          <div style={{ width:34,height:34,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,boxShadow:"0 4px 14px rgba(99,102,241,.4)" }}>📖</div>
          Learnova
        </div>

        <ul style={{ display:"flex",gap:32,listStyle:"none" }}>
          {[["Features","#features"],["How it works","#how"],["Testimonials","#testimonials"]].map(([l,h])=>(
            <li key={l}><a href={h} className="nav-a">{l}</a></li>
          ))}
        </ul>

        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <button
  onClick={() => navigate("/login")}
  className="btn-gst"
  style={{
    background: "transparent",
    border: "1px solid rgba(255,255,255,.2)",
    color: "rgba(255,255,255,.8)",
    padding: "8px 18px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  }}
>
  Sign In
</button>
          <button
  onClick={() => navigate("/register")}
  className="btn-pry"
  style={{
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    border: "none",
    color: "#fff",
    padding: "9px 20px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 14px rgba(99,102,241,.35)",
  }}
>
  Get Started Free
</button>
</div>
</nav>
      {/* ── HERO ── */}
      <section style={{ position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"100px 40px 60px",zIndex:1 }}>

        {/* Radial glow */}
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:700,height:500,background:"radial-gradient(ellipse,rgba(99,102,241,.2) 0%,rgba(139,92,246,.08) 50%,transparent 80%)",pointerEvents:"none",borderRadius:"50%" }} />

        {/* Badge */}
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.35)",color:"#a5b4fc",padding:"6px 16px",borderRadius:100,fontSize:12,fontWeight:600,marginBottom:28,letterSpacing:"0.3px" }}>
          <div style={{ width:7,height:7,background:"#6366f1",borderRadius:"50%",animation:"pulse2 2s ease-in-out infinite" }} />
          AI-powered study assistant
        </div>

        <h1 style={{ fontSize:"clamp(42px,6vw,68px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2.5px",marginBottom:22,color:"#fff" }}>
          Study smarter<br />
          <span style={{ background:"linear-gradient(135deg,#818cf8 0%,#c084fc 50%,#f472b6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>with AI</span>
        </h1>

        <p style={{ fontSize:18,color:"rgba(255,255,255,.55)",maxWidth:540,lineHeight:1.7,marginBottom:40,fontWeight:400 }}>
          Transform any PDF into summaries, quizzes, and flashcards in seconds.
          Your personal AI tutor is available 24/7.
        </p>

        <div style={{ display:"flex",gap:14,justifyContent:"center",marginBottom:64,flexWrap:"wrap" }}>
          <button  onClick={() => navigate("/register")} className="btn-hp" style={{ background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",color:"#fff",padding:"15px 32px",borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 8px 30px rgba(99,102,241,.4)",display:"flex",alignItems:"center",gap:8 }}>
            Start learning free <span>→</span>
          </button>
          <button  onClick={() => navigate("/login")} className="btn-hg" style={{ background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.8)",padding:"15px 32px",borderRadius:14,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",backdropFilter:"blur(10px)" }}>
            Sign in
          </button>
        </div>

        {/* App preview card */}
        <div style={{ background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:24,padding:24,maxWidth:680,width:"100%",backdropFilter:"blur(20px)",position:"relative",margin:"0 auto",boxShadow:"0 40px 80px rgba(0,0,0,.4)" }}>

          <div style={{ position:"absolute",top:-12,left:-12,background:"#10b981",color:"#fff",fontSize:10,fontWeight:700,padding:"5px 10px",borderRadius:100,boxShadow:"0 4px 12px rgba(16,185,129,.4)",animation:"chipBounce 2s ease-in-out infinite",whiteSpace:"nowrap" }}>✅ Generated in 3s</div>
          <div style={{ position:"absolute",bottom:-12,right:-12,background:"#8b5cf6",color:"#fff",fontSize:10,fontWeight:700,padding:"5px 10px",borderRadius:100,boxShadow:"0 4px 12px rgba(139,92,246,.4)",animation:"chipBounce 2s .5s ease-in-out infinite",whiteSpace:"nowrap" }}>🧠 10 questions ready</div>

          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:20 }}>
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#ef4444" }} />
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#f59e0b" }} />
            <div style={{ width:10,height:10,borderRadius:"50%",background:"#10b981" }} />
            <div style={{ flex:1,background:"rgba(255,255,255,.07)",borderRadius:6,height:22,marginLeft:8,display:"flex",alignItems:"center",padding:"0 12px" }}>
              <span style={{ fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:500 }}>learnova.ai/dashboard</span>
            </div>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
            {[
              { icon:"📝",label:"AI summary",  bg:"rgba(16,185,129,.08)",  bd:"rgba(16,185,129,.25)" },
              { icon:"🧠",label:"Smart quiz",  bg:"rgba(139,92,246,.08)",  bd:"rgba(139,92,246,.25)" },
              { icon:"🃏",label:"Flashcards",  bg:"rgba(245,158,11,.08)",  bd:"rgba(245,158,11,.25)" },
            ].map(c=>(
              <div key={c.label} style={{ background:c.bg,border:`1px solid ${c.bd}`,borderRadius:16,padding:"18px 14px",textAlign:"center" }}>
                <div style={{ fontSize:26,marginBottom:8 }}>{c.icon}</div>
                <div style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,.85)",marginBottom:10 }}>{c.label}</div>
                {["100%","70%","100%","50%"].map((w,i)=>(
                  <div key={i} className="prev-line" style={{ width:w,margin:i>0?"0 auto 5px":"0 0 5px" }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ position:"relative",zIndex:1,background:"linear-gradient(135deg,#6366f1,#7c3aed)",padding:"56px 40px" }}>
        <div style={{ maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:40,textAlign:"center" }}>
          {STATS.map((s,i)=>(
            <FadeUp key={i} delay={i*100}>
              <div style={{ fontSize:40,fontWeight:900,color:"#fff",letterSpacing:"-1.5px",lineHeight:1,marginBottom:6 }}>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize:13,color:"rgba(255,255,255,.7)",fontWeight:500 }}>{s.label}</div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ position:"relative",zIndex:1,padding:"96px 40px",background:"rgba(14,14,34,.97)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <FadeUp style={{ textAlign:"center",marginBottom:56 }}>
            <span className="s-tag tag-i">Features</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:900,letterSpacing:"-1.5px",color:"#fff",marginBottom:12,lineHeight:1.1 }}>Everything to ace your exams</h2>
            <p style={{ fontSize:16,color:"rgba(255,255,255,.45)",maxWidth:480,lineHeight:1.7,margin:"0 auto" }}>
              Learnova combines powerful AI tools into one seamless, distraction-free study experience.
            </p>
          </FadeUp>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
            {FEATURES.map((f,i)=>(
              <FadeUp key={i} delay={i*80}>
                <div className="feat-card">
                  <div style={{ width:52,height:52,borderRadius:14,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:18 }}>{f.icon}</div>
                  <div style={{ fontSize:16,fontWeight:700,color:"#fff",marginBottom:8 }}>{f.name}</div>
                  <div style={{ fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.65 }}>{f.desc}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ position:"relative",zIndex:1,padding:"96px 40px",background:"rgba(10,10,26,.97)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <FadeUp style={{ textAlign:"center",marginBottom:56 }}>
            <span className="s-tag tag-p">How it works</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:900,letterSpacing:"-1.5px",color:"#fff",lineHeight:1.1 }}>Three steps to smarter studying</h2>
          </FadeUp>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,position:"relative" }}>
            {/* Connector line */}
            <div style={{ position:"absolute",top:52,left:"calc(16.67% + 26px)",right:"calc(16.67% + 26px)",height:1,background:"linear-gradient(90deg,rgba(99,102,241,.5),rgba(139,92,246,.5))",pointerEvents:"none" }} />
            {STEPS.map((s,i)=>(
              <FadeUp key={i} delay={i*150}>
                <div className="step-card">
                  <div style={{ position:"relative",display:"inline-block",marginBottom:20 }}>
                    <div style={{ width:80,height:80,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,boxShadow:"0 12px 32px rgba(99,102,241,.35)",margin:"0 auto" }}>{s.icon}</div>
                    <div style={{ position:"absolute",top:-6,right:-10,width:26,height:26,background:"#0a0a1a",border:"2px solid #6366f1",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#818cf8" }}>{s.num}</div>
                  </div>
                  <div style={{ fontSize:18,fontWeight:700,color:"#fff",marginBottom:10 }}>{s.name}</div>
                  <div style={{ fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.65 }}>{s.desc}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ position:"relative",zIndex:1,padding:"96px 40px",background:"rgba(14,14,34,.97)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <FadeUp style={{ textAlign:"center",marginBottom:56 }}>
            <span className="s-tag tag-g">Testimonials</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:900,letterSpacing:"-1.5px",color:"#fff",lineHeight:1.1 }}>Students love Learnova</h2>
          </FadeUp>
          <FadeUp>
            <div style={{ position:"relative",minHeight:250,maxWidth:640,margin:"0 auto" }}>
              {TESTIMONIALS.map((t,i)=>(
                <div key={i} style={{
                  background:"rgba(255,255,255,.04)",
                  border:"1px solid rgba(255,255,255,.1)",
                  borderRadius:24,padding:36,textAlign:"center",
                  maxWidth:640,margin:"0 auto",
                  position: i===activeTest?"relative":"absolute",
                  inset:0,
                  opacity: i===activeTest?1:0,
                  transform: i===activeTest?"scale(1)":"scale(.97)",
                  transition:"all .5s ease",
                  pointerEvents: i===activeTest?"auto":"none",
                }}>
                  <div style={{ fontSize:36,color:"rgba(99,102,241,.4)",fontFamily:"Georgia,serif",lineHeight:1,marginBottom:16 }}>"</div>
                  <p style={{ fontSize:15,color:"rgba(255,255,255,.7)",lineHeight:1.75,fontStyle:"italic",marginBottom:24 }}>{t.text}</p>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
                    <div style={{ width:42,height:42,borderRadius:"50%",background:t.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"#fff" }}>{t.avatar}</div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:700,color:"#fff" }}>{t.name}</div>
                      <div style={{ fontSize:12,color:"rgba(255,255,255,.4)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex",justifyContent:"center",gap:8,marginTop:32 }}>
              {TESTIMONIALS.map((_,i)=>(
                <button key={i} className={`test-dot${i===activeTest?" on":""}`} style={{ width:i===activeTest?24:8 }} onClick={()=>setActiveTest(i)} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position:"relative",zIndex:1,padding:"100px 40px",textAlign:"center",background:"rgba(10,10,26,.97)",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:400,background:"radial-gradient(ellipse,rgba(99,102,241,.15) 0%,transparent 70%)",pointerEvents:"none" }} />
        <FadeUp>
          <h2 style={{ fontSize:"clamp(32px,5vw,52px)",fontWeight:900,letterSpacing:"-2px",color:"#fff",marginBottom:16,position:"relative" }}>Ready to study smarter?</h2>
          <p style={{ fontSize:17,color:"rgba(255,255,255,.45)",marginBottom:44,position:"relative" }}>Join 10,000+ students already using Learnova to ace their exams.</p>
          <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            <button
  onClick={() => navigate("/register")}
  className="btn-hp"
  style={{
    background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
    border:"none",
    color:"#fff",
    padding:"15px 32px",
    borderRadius:14,
    fontSize:15,
    fontWeight:700,
    cursor:"pointer",
    fontFamily:"inherit",
    boxShadow:"0 8px 30px rgba(99,102,241,.4)",
    display:"flex",
    alignItems:"center",
    gap:8
  }}
>
  Get Started Free →
</button>

<button
  onClick={() => navigate("/login")}
  className="btn-hg"
  style={{
    background:"rgba(255,255,255,.07)",
    border:"1px solid rgba(255,255,255,.15)",
    color:"rgba(255,255,255,.8)",
    padding:"15px 32px",
    borderRadius:14,
    fontSize:15,
    fontWeight:600,
    cursor:"pointer",
    fontFamily:"inherit",
    backdropFilter:"blur(10px)"
  }}
>
  Sign In
</button>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position:"relative",zIndex:1,background:"#070712",borderTop:"1px solid rgba(255,255,255,.06)",padding:"32px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,fontSize:16,fontWeight:800,color:"#fff" }}>
          <div style={{ width:28,height:28,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>📖</div>
          Learnova
        </div>
        <p style={{ fontSize:12,color:"rgba(255,255,255,.3)" }}>© 2026 Learnova. Built with ❤️ for students.</p>
        <div style={{ display:"flex",gap:24 }}>
          {["Privacy","Terms","Contact"].map(item=>(
            <span key={item} className="footer-a">{item}</span>
          ))}
        </div>
      </footer>

    </div>
  );
}
