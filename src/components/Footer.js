import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-red-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎬</span>
              </div>
              <span className="text-white font-bold text-xl">MovieDB</span>
            </Link>
            <p className="text-gray-400">
              Discover, search, and explore thousands of movies. Your ultimate movie database.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/movies/popular" className="text-gray-400 hover:text-white transition-colors">
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link to="/movies/top-rated" className="text-gray-400 hover:text-white transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link to="/movies/upcoming" className="text-gray-400 hover:text-white transition-colors">
                  Upcoming
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li className="text-gray-500 text-sm mt-4">
                © {new Date().getFullYear()} MovieDB. All rights reserved.
              </li>
              <li className="text-gray-500 text-sm">
                Data provided by TMDB
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;