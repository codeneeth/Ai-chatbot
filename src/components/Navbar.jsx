import React from "react";
import { FaDev } from "react-icons/fa"; // ✅ correct icon import

const Navbar = () => {
  return (
    <div className="max-w-5xl mx-auto text-white ">
      <div className="flex justify-between items-center p-5 sticky top-0 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg z-50 transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="h-6 w-1 bg-white"></div>
            <div className="h-10 w-1 bg-white"></div>
            <div className="h-6 w-1 bg-white"></div>
          </div>
          <span className="font-bold text-lg">NeethOs</span>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-indigo-400 pb-1"
            >
              Chat
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-indigo-300 pb-1"
            >
              History
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-indigo-300 pb-1"
            >
              Docs
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-indigo-300 pb-1"
            >
              Pricing
            </a>
          </li>
        </ul>

        {/* Buttons + Icon */}
        <div className="flex items-center gap-3">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Feedback
          </button>
          <a
            href="https://github.com/codeneeth"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-600 hover:border-gray-500"
          >
            <span>Contact Dev.</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
