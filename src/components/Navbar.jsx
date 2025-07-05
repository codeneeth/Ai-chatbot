import React, { useState, useEffect } from "react";
import { FiUser, FiMoon, FiSun, FiMenu, FiX, FiMessageSquare, FiBook, FiDollarSign, FiGithub } from "react-icons/fi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Chat");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = [
    { name: "Chat", icon: <FiMessageSquare />, href: "#chat" },
    { name: "Docs", icon: <FiBook />, href: "#docs" },
    { name: "Pricing", icon: <FiDollarSign />, href: "#pricing" },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${darkMode ? 'dark' : ''} ${
      scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className={`h-6 w-1 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'} rounded-full`}></div>
              <div className={`h-10 w-1 ${darkMode ? 'bg-indigo-500' : 'bg-indigo-600'} rounded-full`}></div>
              <div className={`h-6 w-1 ${darkMode ? 'bg-indigo-400' : 'bg-indigo-500'} rounded-full`}></div>
            </div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>NeethOs</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                  activeLink === link.name
                    ? `${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
                }`}
                onClick={() => setActiveLink(link.name)}
              >
                {link.icon}
                {link.name}
                {activeLink === link.name && (
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 ${
                    darkMode ? 'bg-indigo-500' : 'bg-indigo-400'
                  } rounded-full`}></span>
                )}
              </a>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon />}
            </button>

            {/* Feedback button */}
            <button
              className={`hidden md:block py-2 px-4 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                  : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
              } font-medium`}
            >
              Feedback
            </button>

            {/* GitHub button */}
            <a
              href="https://github.com/codeneeth"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors`}
            >
              <FiGithub className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
            </a>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className={darkMode ? 'text-white' : 'text-gray-900'} size={20} />
              ) : (
                <FiMenu className={darkMode ? 'text-gray-400' : 'text-gray-600'} size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden mt-2 pb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
            <div className="px-2 pt-2 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium ${
                    activeLink === link.name
                      ? darkMode 
                        ? 'bg-gray-700 text-indigo-400' 
                        : 'bg-indigo-100 text-indigo-600'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveLink(link.name);
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.icon}
                  {link.name}
                </a>
              ))}
              <div className="flex justify-center gap-4 pt-2">
                <button
                  className={`py-2 px-4 rounded-lg ${
                    darkMode 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                  } font-medium`}
                >
                  Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;