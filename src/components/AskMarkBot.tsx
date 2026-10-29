"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  MinusIcon,
  ArrowPathIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[];
}

interface AskMarkBotProps {
  applicationsCount?: number;
}

export default function AskMarkBot({ applicationsCount = 0 }: AskMarkBotProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialMessages: Message[] = [
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! 👋 I'm Mark, your Maatram AI Assistant. I can help answer queries about scholarship eligibility, cutoff cutoffs, student verification, partner colleges, and alumni network.",
      timestamp: "Just now",
      options: [
        "Cutoff eligibility criteria",
        "3-stage verification flow",
        "Partner colleges list",
        "First-graduate priority",
      ],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // Contextual AI response logic
    setTimeout(() => {
      let botReply = "";
      const lower = text.toLowerCase();

      if (lower.includes("cutoff") || lower.includes("mark")) {
        botReply = "For Engineering admissions, Maatram looks for 12th HSC Cutoffs above 165-170/200. Special affirmative weightage is given to first-generation graduates, rural government school students, and single-parent backgrounds.";
      } else if (lower.includes("verification") || lower.includes("stage") || lower.includes("process")) {
        botReply = "The 3-stage scholarship evaluation process:\n1. Online Application Screening (12th Marks & Family Income)\n2. Telephonic Verification Call with Candidate and Parents\n3. Physical Home Visit & Background Inquiries by Trustees.";
      } else if (lower.includes("college") || lower.includes("partner")) {
        botReply = "Maatram collaborates with top Tamil Nadu engineering institutions (including PSG Tech, CIT, SKCET, TCE, SASTRA, and VIT) to provide 100% free higher education covering tuition, hostel, and food.";
      } else if (lower.includes("first-graduate") || lower.includes("first graduate")) {
        botReply = "First-Graduate students receive high priority in Maatram selection, provided family annual income is within the qualifying threshold (under ₹2,00,000/year).";
      } else if (lower.includes("alumni") || lower.includes("graduate")) {
        botReply = "Maatram Alumni network consists of 320+ graduates placed at top tier technology firms (Zoho, TCS, Infosys, Amazon) who actively mentor current scholars.";
      } else if (lower.includes("event") || lower.includes("workshop")) {
        botReply = "Regular orientation workshops, mock interview bootcamps, and alumni meetups are organized throughout the academic year. You can manage them in the Events portal.";
      } else if (lower.includes("stat") || lower.includes("applicant") || lower.includes("total") || lower.includes("count")) {
        botReply = applicationsCount > 0
          ? `There are currently ${applicationsCount} registered scholarship applications under review in the Maatram system.`
          : "Applications are actively tracked in real-time across Tamil Nadu districts.";
      } else if (lower.includes("contact") || lower.includes("trust") || lower.includes("office") || lower.includes("help")) {
        botReply = "Maatram Foundation Head Office is in Chennai, Tamil Nadu. Official correspondence: contact@maatramfoundation.com.";
      } else {
        botReply = `Understood! You asked: "${text}". I'm Mark, the Maatram AI assistant. I can help with scholarship criteria, student screening guidelines, colleges, and foundation processes. What specific information can I find for you?`;
      }

      const replyMessage: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, replyMessage]);
      setIsTyping(false);
    }, 550);
  };

  const handleReset = () => {
    setMessages(initialMessages);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-primary">
      {/* Floating Chat Launcher Button (Clean Yellow Brand) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center gap-2 px-4 py-2.5 bg-[#F7BC0F] hover:bg-[#eab007] text-slate-950 font-heading font-black text-xs rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95 border border-[#e5ad0c]"
          aria-label="Ask Mark"
        >
          <SparklesIcon className="w-4 h-4 stroke-[2.5]" />
          <span className="tracking-wide">Ask Mark</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 ${
            isMinimized
              ? "w-80 h-16"
              : "w-[360px] sm:w-[410px] h-[520px] max-h-[85vh]"
          }`}
        >
          {/* Header */}
          <div className="bg-[#F7BC0F] text-slate-950 px-4 py-3 flex items-center justify-between border-b border-amber-300/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-950 text-[#F7BC0F] flex items-center justify-center font-heading font-black text-xs">
                M
              </div>
              <div>
                <h4 className="font-heading font-black text-sm tracking-wide text-slate-950 leading-tight">
                  Mark
                </h4>
                <p className="text-[10px] text-slate-900/80 font-medium">Maatram AI Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset Conversation"
                className="p-1.5 text-slate-900 hover:bg-black/10 rounded-lg transition cursor-pointer"
              >
                <ArrowPathIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 text-slate-900 hover:bg-black/10 rounded-lg transition cursor-pointer"
              >
                <MinusIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 text-slate-900 hover:bg-black/10 rounded-lg transition cursor-pointer"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body & Input (Hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Messages scroll area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-2xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-[#F7BC0F] text-slate-950 font-medium rounded-br-xs"
                          : "bg-white text-slate-900 border border-slate-200 rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {m.timestamp}
                    </span>

                    {/* Quick Suggestion Chips */}
                    {m.options && m.options.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.options.map((opt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSend(opt)}
                            className="text-[10px] bg-white hover:bg-[#F7BC0F] text-slate-800 hover:text-slate-950 border border-slate-200 rounded-full px-2.5 py-1 transition cursor-pointer font-medium shadow-2xs"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit shadow-2xs">
                    <span className="w-1.5 h-1.5 bg-[#F7BC0F] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#F7BC0F] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#F7BC0F] rounded-full animate-bounce"></span>
                    <span className="text-[10px] text-slate-500 ml-1">Mark is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask Mark about cutoffs, applicants, rules..."
                    className="flex-1 bg-white hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#F7BC0F] rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 bg-[#F7BC0F] hover:bg-[#eab007] disabled:opacity-40 disabled:hover:bg-[#F7BC0F] text-slate-950 rounded-xl transition cursor-pointer disabled:cursor-not-allowed shadow-xs"
                    title="Send"
                  >
                    <PaperAirplaneIcon className="w-4 h-4 -rotate-45 text-slate-950" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[9px] text-slate-400 px-1">
                  <span>Mark • Maatram AI Assistant</span>
                  <span>Online</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
