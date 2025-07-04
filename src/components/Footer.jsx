import React from 'react';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const SimpleFooter = () => {
  return (
    <footer className="bg-gray-900 max-w-5xl mx-auto border-t border-gray-800 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Branding */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-white font-medium">NeethOs AI</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400 text-sm">Powered by cutting-edge technology</span>
          </div>

          {/* Right side - Socials */}
          <div className="flex space-x-4">
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com/yourhandle" 
              target="_blank" 
              rel="noopener"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Copyright - Centered below on mobile */}
        <div className="mt-6 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} NeethOs AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;