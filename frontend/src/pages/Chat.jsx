import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchChats(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chat");
      setChats(res.data.chats);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      setLoading(true);
      const res = await api.post("/chat", { message });
      setChats([...chats, res.data.chat]);
      setMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col h-[88vh]">

        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-200">
            🤖
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Tutor</h1>
            <p className="text-gray-400 text-sm">Powered by Learnova AI — ask anything</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Online
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">

          {chats.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-4xl mb-4">
                🤖
              </div>
              <h3 className="text-gray-800 font-bold text-lg mb-1">Hello! I am your AI Tutor</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Ask me anything about your studies. I can explain concepts, solve problems, and help you learn faster.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6 w-full max-w-sm">
                {[
                  "Explain photosynthesis",
                  "What is recursion?",
                  "Summarize Newton's laws",
                  "How does TCP/IP work?",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setMessage(suggestion)}
                    className="text-left text-xs bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded-xl px-3 py-2.5 transition text-gray-600 font-medium"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chats.map((chat, index) => (
            <div key={index} className="space-y-3">

              {/* User message */}
              <div className="flex justify-end">
                <div className="flex items-end gap-2 max-w-[75%]">
                  <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
                    {chat.question}
                  </div>
                  <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
                    U
                  </div>
                </div>
              </div>

              {/* AI message */}
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[75%]">
                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-base flex-shrink-0 mb-0.5">
                    🤖
                  </div>
                  <div className="bg-gray-50 border border-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                    {chat.answer}
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-base flex-shrink-0">
                  🤖
                </div>
                <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex gap-3 items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendMessage(); }}
            placeholder="Ask anything..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
          >
            {loading ? "..." : "Send"} {!loading && <span>→</span>}
          </button>
        </div>

      </div>
    </Layout>
  );
}