import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { movieAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';

const Home = ({ type = 'popular' }) => {
    const [viewMode, setViewMode] = useState('pagination');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  
  // What: Get URL parameters for pagination and search
  // Why: Enable bookmarkable URLs and browser navigation
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  const urlSearchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // What: Update URL parameters
  // Why: Sync state with URL for sharing and navigation
  const updateURLParams = useCallback((updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    // Always reset to page 1 when search changes
    if (updates.search !== undefined) {
      newParams.set('page', '1');
    }
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // What: Fetch movies with current parameters
  // Why: Centralized data fetching with error handling
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      const pageToFetch = currentPage;
      
      if (urlSearchQuery) {
        data = await movieAPI.searchMovies(urlSearchQuery, pageToFetch);
      } else {
        switch(type) {
          case 'top-rated':
            data = await movieAPI.getTopRatedMovies(pageToFetch);
            break;
          case 'upcoming':
            data = await movieAPI.getUpcomingMovies(pageToFetch);
            break;
          case 'popular':
          default:
            data = await movieAPI.getPopularMovies(pageToFetch);
            break;
        }
      }
      
      setMovies(data.results);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB limits to 500 pages
      setTotalResults(data.total_results);
    } catch (error) {
      console.error('Error fetching movies:', error);
      // Show empty state on error
      setMovies([]);
      setTotalPages(0);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [urlSearchQuery, currentPage, type]);

  // What: Handle search
  // Why: Update URL and trigger new fetch
  const handleSearch = (query) => {
    updateURLParams({ search: query });
  };

  // What: Handle page change
  // Why: Navigate between pages efficiently
  const handlePageChange = (newPage) => {
    updateURLParams({ page: newPage.toString() });
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // What: Initial data fetch
  // Why: Load movies when component mounts or dependencies change
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // What: Reset to page 1 when search changes
  // Why: Better UX - start from first page on new search
  useEffect(() => {
    if (urlSearchQuery && currentPage !== 1) {
      updateURLParams({ page: '1' });
    }
  }, [urlSearchQuery, currentPage, updateURLParams]);

  // What: Get page title based on current view
  const getPageTitle = () => {
    if (urlSearchQuery) return `Search: "${urlSearchQuery}"`;
    
    const path = location.pathname;
    if (path.includes('top-rated')) return 'Top Rated Movies';
    if (path.includes('upcoming')) return 'Upcoming Movies';
    if (path.includes('popular')) return 'Popular Movies';
    return 'Popular Movies';
  };

  // What: Get results summary text
  const getResultsSummary = () => {
    if (loading) return 'Loading movies...';
    if (movies.length === 0) return 'No movies found';
    
    const start = (currentPage - 1) * 20 + 1;
    const end = Math.min(currentPage * 20, totalResults);
    
    if (urlSearchQuery) {
      return `Showing ${start}-${end} of ${totalResults.toLocaleString()} results for "${urlSearchQuery}"`;
    }
    
    return `Showing ${start}-${end} of ${totalResults.toLocaleString()} movies`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {getPageTitle()}
          </h1>
          <p className="text-gray-400">
            {getResultsSummary()}
          </p>
        </div>

        {/* Search Bar (only show on home page) */}
        {location.pathname === '/' && (
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch} 
              initialQuery={urlSearchQuery} 
            />
          </div>
        )}

        {/* Loading State */}
        {loading && movies.length === 0 ? (
          <div className="py-20">
            <LoadingSpinner />
            <p className="text-center text-gray-400 mt-4">
              Loading movies from TMDB...
            </p>
          </div>
        ) : movies.length > 0 ? (
          <>
            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={`${movie.id}-${currentPage}`} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              siblingCount={1}
              boundaryCount={1}
            />

            {/* Quick Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                >
                  ← Previous Page
                </button>
              )}
              
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Next Page →
                </button>
              )}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl text-white mb-2">No Movies Found</h3>
            <p className="text-gray-400 mb-6">
              {urlSearchQuery 
                ? `We couldn't find any movies matching "${urlSearchQuery}"`
                : 'There are no movies available at the moment.'
              }
            </p>
            {urlSearchQuery && (
              <button
                onClick={() => updateURLParams({ search: '' })}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
  <div className="text-gray-400">
    {totalResults.toLocaleString()} movies found
  </div>
  
  <div className="flex items-center space-x-4">
    <span className="text-gray-400 text-sm">View:</span>
    <div className="flex bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setViewMode('pagination')}
        className={`px-4 py-2 rounded transition-colors ${
          viewMode === 'pagination'
            ? 'bg-red-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        Pagination
      </button>
      <button
        onClick={() => setViewMode('infinite')}
        className={`px-4 py-2 rounded transition-colors ${
          viewMode === 'infinite'
            ? 'bg-red-600 text-white'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        Infinite Scroll
      </button>
    </div>
  </div>
</div>

        {/* API Info Footer */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            Data provided by The Movie Database (TMDB)
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Page {currentPage} of {totalPages} • {movies.length} movies displayed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;