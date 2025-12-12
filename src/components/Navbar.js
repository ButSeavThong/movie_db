import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { movieAPI } from '../services/api';

const Navbar = () => {
  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Refs for click outside detection
  const searchResultsRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const urlSearchQuery = searchParams.get('search') || '';

  // Mock user data (in real app, get from context/Redux)
  const [user] = useState({
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MovieLover',
    isLoggedIn: true
  });

  // What: Check if link is active
  // Why: Highlight current page for better UX
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !urlSearchQuery;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // What: Handle search with debouncing
  // Why: Prevent too many API calls while typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearchLoading(true);
        try {
          const data = await movieAPI.searchMovies(searchQuery, 1);
          setSearchResults(data.results.slice(0, 5)); // Show top 5 results
          setShowSearchResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // What: Handle search submission
  // Why: Navigate to search results page
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearchResults(false);
      setIsMenuOpen(false);
      // Blur input on mobile to hide keyboard
      if (window.innerWidth < 768) {
        searchInputRef.current?.blur();
      }
    }
  };

  // What: Handle direct movie selection from search results
  // Why: Quick navigation to movie details
  const handleMovieSelect = (movieId) => {
    navigate(`/movie/${movieId}`);
    setSearchQuery('');
    setShowSearchResults(false);
    setIsMenuOpen(false);
  };

  // What: Handle click outside to close dropdowns
  // Why: Better UX - dropdowns close when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search results
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      
      // Close user menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      
      // Close mobile menu when clicking on links
      if (isMenuOpen && window.innerWidth < 768) {
        if (event.target.tagName === 'A' || event.target.closest('a')) {
          setTimeout(() => setIsMenuOpen(false), 100);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // What: Handle keyboard shortcuts
  // Why: Power users love shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Escape to close dropdowns
      if (e.key === 'Escape') {
        setShowSearchResults(false);
        setUserMenuOpen(false);
        if (window.innerWidth < 768) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // What: Clear search when navigating away
  // Why: Clean state management
  useEffect(() => {
    setShowSearchResults(false);
    setSearchQuery('');
  }, [location.pathname]);

  // What: Navigation items configuration
  // Why: Easier to manage and extend
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠', mobileOnly: false },
    { path: '/movies/popular', label: 'Popular', icon: '🔥', mobileOnly: false },
    { path: '/movies/top-rated', label: 'Top Rated', icon: '⭐', mobileOnly: false },
    { path: '/movies/upcoming', label: 'Upcoming', icon: '📅', mobileOnly: false },
    { path: '/watchlist', label: 'My Watchlist', icon: '🎬', mobileOnly: true },
    { path: '/favorites', label: 'Favorites', icon: '❤️', mobileOnly: true },
  ];

  // What: User menu items
  const userMenuItems = [
    { label: 'Profile', icon: '👤', path: '/profile' },
    { label: 'Settings', icon: '⚙️', path: '/settings' },
    { label: 'Watch History', icon: '📖', path: '/history' },
    { label: 'Sign Out', icon: '🚪', path: '/logout' },
  ];

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4">
        {/* Main Navbar */}
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
            >
              <div className="bg-gradient-to-br from-red-600 to-red-700 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white text-xl">🎬</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-white font-bold text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  MovieDB
                </h1>
                <p className="text-xs text-gray-400">Your Cinema Universe</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden lg:flex items-center space-x-1 mx-8 flex-1 justify-center">
            {navItems
              .filter(item => !item.mobileOnly)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                placeholder="Search movies, actors..."
                className="w-full px-5 py-3 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pl-12 pr-12"
              />
              
              {/* Search Icon */}
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                🔍
              </button>
              
              {/* Keyboard Shortcut Hint */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden lg:block">
                <kbd className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                  ⌘K
                </kbd>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div 
                ref={searchResultsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
              >
                {isSearchLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm text-gray-400">
                        Search Results for "<span className="text-white">{searchQuery}</span>"
                      </p>
                    </div>
                    {searchResults.map((movie) => (
                      <button
                        key={movie.id}
                        onClick={() => handleMovieSelect(movie.id)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center space-x-3 group"
                      >
                        <img
                          src={movieAPI.getImageUrl(movie.poster_path, 'w92')}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium group-hover:text-red-400 transition-colors">
                            {movie.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {movie.release_date?.substring(0, 4)} • ⭐ {movie.vote_average.toFixed(1)}
                          </p>
                        </div>
                        <span className="text-gray-400 group-hover:text-white">→</span>
                      </button>
                    ))}
                    <div className="px-4 py-3 border-t border-gray-700 bg-gray-900">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center justify-center w-full"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </>
                ) : searchQuery.length > 2 ? (
                  <div className="p-4 text-center text-gray-400">
                    No movies found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Right Section - User & Actions */}
          <div className="flex items-center space-x-4">
            
            {/* User Profile (Desktop) */}
            {user.isLoggedIn ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 group"
                >
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">Premium Member</p>
                  </div>
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-red-500 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <span className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-sm text-gray-400">john@example.com</p>
                        </div>
                      </div>
                    </div>
                    
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-white">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors font-medium"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile Search Button */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                searchInputRef.current?.focus();
              }}
              className="md:hidden text-gray-300 hover:text-white p-2"
            >
              🔍
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out mt-1 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="py-4">
              {/* Mobile Search Bar */}
              <div className="px-4 mb-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pl-12"
                  />
                  <button
                    type="submit"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    🔍
                  </button>
                </form>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile User Section */}
              <div className="border-t border-gray-700 mt-4 pt-4">
                {user.isLoggedIn ? (
                  <div className="px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">View Profile</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Additional Mobile Links */}
              <div className="px-4 mt-4 space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm py-2">
                  Help Center
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm py-2">
                  About MovieDB
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm py-2">
                  Contact Us
                </a>
              </div>

              {/* Theme Toggle (Mobile) */}
              <div className="px-4 mt-4">
                <button className="flex items-center justify-between w-full py-3 text-gray-300 hover:text-white">
                  <span>🌙 Dark Mode</span>
                  <div className="w-12 h-6 bg-gray-700 rounded-full relative">
                    <div className="w-5 h-5 bg-red-500 rounded-full absolute right-1 top-0.5"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Indicator for Search */}
      {isSearchLoading && (
        <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
      )}
    </nav>
  );
};

export default Navbar;