import { useState, useEffect, useRef } from "react";
import { processChatMessage, INITIAL_SUGGESTIONS } from "./chatbotService";

export default function Chatbot({ setActive }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! 👋 I'm your **Society AI Assistant**.\n\nAsk me anything about maintenance dues, complaints, society notices, events, or resident details — or tell me to navigate anywhere!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Clear unread badge when chat is opened & focus input
  const toggleChat = () => {
    if (!isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    setIsOpen((prev) => !prev);
  };

  // Clear chat history
  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Chat cleared! How can I assist you now?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
      },
    ]);
  };

  // Send message handler
  const handleSend = async (customQuery) => {
    const textToSend = customQuery || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInput("");
    setIsTyping(true);

    try {
      const response = await processChatMessage(textToSend, setActive);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        targetTab: response.targetTab,
        actionLabel: response.actionLabel,
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If auto-navigate requested
      if (response.autoNavigate && response.targetTab && setActive) {
        setTimeout(() => {
          setActive(response.targetTab);
        }, 600);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "Apologies, I encountered a temporary issue. Please try asking again!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestions: INITIAL_SUGGESTIONS.map((s) => s.label),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Render text formatting (supports bold ** and linebreaks)
  const formatText = (content) => {
    const lines = content.split("\n");
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lIdx} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-semibold text-gray-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          aria-label="Open AI Assistant"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-[0_8px_25px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_32px_rgba(79,70,229,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Ambient Glow Pulse */}
          <span className="absolute -inset-1 rounded-full bg-indigo-500/30 animate-ping pointer-events-none" />

          {/* Unread Badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white ring-2 ring-white animate-bounce shadow-md">
              {unreadCount}
            </span>
          )}

          {/* Icon Toggle */}
          {isOpen ? (
            <svg className="w-6 h-6 transform rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 transform transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] sm:w-[420px] h-[540px] max-h-[82vh] rounded-3xl bg-white/95 backdrop-blur-2xl border border-indigo-100 shadow-[0_20px_50px_rgba(15,23,42,0.25)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-4 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <span className="text-xl">🤖</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-700 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">Society AI Assistant</h3>
                <p className="text-[11px] text-indigo-200 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active • Smart Navigation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear chat history"
                className="p-1.5 rounded-xl hover:bg-white/15 text-indigo-100 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={toggleChat}
                title="Close chat"
                className="p-1.5 rounded-xl hover:bg-white/15 text-indigo-100 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} space-y-1.5`}
              >
                <div className="flex items-end gap-2 max-w-[85%]">
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs shrink-0 shadow-sm">
                      🤖
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 text-xs shadow-sm ${msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                      }`}
                  >
                    {formatText(msg.text)}

                    {/* Target Navigation Button */}
                    {msg.targetTab && setActive && (
                      <button
                        onClick={() => setActive(msg.targetTab)}
                        className="mt-2.5 inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl text-[11px] border border-indigo-200/80 transition-all active:scale-95 cursor-pointer shadow-xs"
                      >
                        {msg.actionLabel || "Navigate Now"}
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 px-1 font-medium">
                  {msg.timestamp}
                </span>

                {/* Quick Suggestion Chips attached to last bot message */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="bg-white hover:bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-indigo-100 hover:border-indigo-300 shadow-xs transition-all active:scale-95 cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs shrink-0">
                  🤖
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                  <span className="text-[11px] font-semibold text-gray-400 ml-1">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI or type 'Take me to complaints'..."
                className="flex-1 bg-gray-50 text-xs text-gray-800 placeholder-gray-400 rounded-xl px-3.5 py-2.5 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white p-2.5 rounded-xl transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
