import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiUser, FiCopy } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/atom-one-dark.css";

const API_KEY = import.meta.env.VITE_GEMINI_API;

const SafeMarkdown = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <div className="relative group">
              <div className="absolute top-2 right-2 text-xs text-gray-400">
                {match?.[1] || "code"}
              </div>
              <pre className="hljs rounded-lg p-4 overflow-x-auto bg-gray-800/90">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-pink-400">
              {children}
            </code>
          );
        },
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const ChatFace = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm NeethOs AI. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (inputValue.trim() === "" || loading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: inputValue }],
            },
          ],
        }
      );

      const aiResponse =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Error: Failed to get response",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-4 py-6 border border-gray-700/50 rounded-2xl bg-gray-800/90 backdrop-blur-md shadow-lg">
      <div className="flex-1 overflow-y-auto pr-1 mb-4 space-y-6 scrollbar-none">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              } items-start gap-3`}
            >
              <div
                className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full ${
                  message.sender === "user" ? "bg-indigo-600" : "bg-emerald-600"
                }`}
              >
                {message.sender === "user" ? (
                  <FiUser className="text-white text-sm" />
                ) : (
                  <FaRobot className="text-white text-sm" />
                )}
              </div>
              <div
                className={`relative px-4 py-3 text-sm rounded-2xl shadow-md transition-all duration-200 ${
                  message.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-gray-700 text-gray-100 rounded-tl-none"
                }`}
              >
                {message.sender === "ai" ? (
                  <SafeMarkdown content={message.text} />
                ) : (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                )}

                {message.sender === "ai" && (
                  <button
                    onClick={() => handleCopy(message.text)}
                    className="absolute top-2 right-2 opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                    title="Copy message"
                  >
                    <FiCopy className="text-base" />
                  </button>
                )}

                <p
                  className={`text-xs mt-2 ${
                    message.sender === "user" ? "text-indigo-200" : "text-gray-400"
                  } text-right`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] items-start gap-3">
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-gray-700 text-gray-100 rounded-tl-none shadow-md">
                <div className="flex gap-1 animate-pulse">
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-800/90 backdrop-blur-md rounded-xl p-4 border border-gray-700/50">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 p-3 rounded-lg bg-gray-700/80 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-gray-600/50 transition-all placeholder-gray-500 resize-none"
            rows={2}
            placeholder="Type your message here..."
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className="self-end bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white p-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatFace;
