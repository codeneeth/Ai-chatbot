import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiUser, FiCopy, FiCheck } from "react-icons/fi";
import { FaRobot, FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { IoSunnyOutline, IoSunny } from "react-icons/io5";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/atom-one-dark.css";

const API_KEY = import.meta.env.VITE_GEMINI_API;

const SafeMarkdown = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  try {
    return (
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600/50 transition-colors text-gray-300 hover:text-white"
          title="Copy to clipboard"
        >
          {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
        </button>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <div className="relative">
                  <div className="absolute top-2 right-2 text-xs text-gray-400">
                    {match?.[1] || "code"}
                  </div>
                  <pre className="hljs rounded-md p-4 overflow-x-auto bg-gray-800/90">
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
            table({ children }) {
              return (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-600">
                    {children}
                  </table>
                </div>
              );
            },
            th({ children }) {
              return (
                <th className="border border-gray-600 px-4 py-2 bg-gray-700/50 text-left">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="border border-gray-600 px-4 py-2">{children}</td>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.error("Markdown rendering error:", error);
    return <div className="whitespace-pre-wrap">{content}</div>;
  }
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
  const [darkMode, setDarkMode] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(false);
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
    setTypingIndicator(true);

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
          text: "Error: Failed to get response. Please try again later.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTypingIndicator(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`flex flex-col h-[90vh] w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900 border border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 ${
          darkMode ? "bg-gray-800/90" : "bg-white"
        } border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
            <FaRobot className="text-white text-xl" />
          </div>
          <div>
            <h1 className="font-bold text-lg">NeethOs AI</h1>
            <p className="text-xs opacity-70">
              {typingIndicator ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
          } transition-colors`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <IoSunny className="text-yellow-300" />
          ) : (
            <IoSunnyOutline className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Chat messages */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[90%] md:max-w-[80%] ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              } items-start gap-3`}
            >
              <div
                className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full ${
                  message.sender === "user"
                    ? "bg-indigo-600"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600"
                }`}
              >
                {message.sender === "user" ? (
                  <FiUser className="text-white text-sm" />
                ) : (
                  <FaRobot className="text-white text-sm" />
                )}
              </div>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? darkMode
                      ? "bg-indigo-900 text-white rounded-tr-none"
                      : "bg-indigo-100 text-indigo-900 rounded-tr-none"
                    : darkMode
                    ? "bg-gray-800 text-gray-100 rounded-tl-none"
                    : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                } ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } border`}
              >
                {message.sender === "ai" ? (
                  <SafeMarkdown content={message.text} />
                ) : (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                )}
                <div
                  className={`flex items-center justify-between mt-2 text-xs ${
                    message.sender === "user"
                      ? darkMode
                        ? "text-indigo-300"
                        : "text-indigo-500"
                      : darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <span>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.sender === "ai" && (
                    <div className="flex gap-2 ml-4">
                      <button
                        className="hover:text-green-500 transition-colors"
                        title="Helpful"
                      >
                        <FaRegThumbsUp />
                      </button>
                      <button
                        className="hover:text-red-500 transition-colors"
                        title="Not helpful"
                      >
                        <FaRegThumbsDown />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row items-start gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600">
                <FaRobot className="text-white text-sm" />
              </div>
              <div
                className={`px-4 py-3 rounded-2xl rounded-tl-none ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ${darkMode ? "border-gray-700" : "border-gray-200"} border`}
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        className={`p-4 ${
          darkMode ? "bg-gray-800/90" : "bg-white"
        } border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
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
            className={`flex-1 p-3 rounded-xl focus:outline-none focus:ring-2 transition-all placeholder-gray-500 resize-none ${
              darkMode
                ? "bg-gray-700/80 text-gray-100 focus:ring-indigo-500/50 border-gray-600/50"
                : "bg-gray-100 text-gray-900 focus:ring-indigo-300 border-gray-300"
            } border`}
            rows={1}
            placeholder="Message NeethOs AI..."
            disabled={loading}
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className={`self-end p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white"
            }`}
          >
            <FiSend className="text-lg" />
          </button>
        </div>
        <p
          className={`text-xs mt-2 text-center ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          NeethOs AI may produce inaccurate information about people, places, or
          facts.
        </p>
      </div>
    </div>
  );
};

export default ChatFace;