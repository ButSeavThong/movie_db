import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  
  // What: Debounce search to prevent too many API calls
  // Why: Better performance and prevent rate limiting
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isTyping) {
        onSearch(query);
        setIsTyping(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, isTyping, onSearch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setIsTyping(false);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={query}
          onChange={handleChange}
          className="w-full px-6 py-4 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pl-14 pr-12 text-lg"
        />
        
        {/* Search Icon */}
        <button
          type="submit"
          className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        {/* Loading Indicator */}
        {isTyping && (
          <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}
        
        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        {/* Keyboard Shortcut Hint */}
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs text-gray-500">
            Press Enter to search • Esc to clear
          </span>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;