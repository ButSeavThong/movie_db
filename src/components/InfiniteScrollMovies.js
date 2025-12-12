import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { movieAPI } from '../services/api';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

const InfiniteScrollMovies = ({ type = 'popular', searchQuery = '' }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // What: Load more movies when scrolled to bottom
  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let data;
      const nextPage = page + 1;
      
      if (searchQuery) {
        data = await movieAPI.searchMovies(searchQuery, nextPage);
      } else {
        switch(type) {
          case 'top-rated':
            data = await movieAPI.getTopRatedMovies(nextPage);
            break;
          case 'upcoming':
            data = await movieAPI.getUpcomingMovies(nextPage);
            break;
          case 'popular':
          default:
            data = await movieAPI.getPopularMovies(nextPage);
            break;
        }
      }
      
      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => [...prev, ...data.results]);
        setPage(nextPage);
        setHasMore(nextPage < data.total_pages && nextPage < 500); // TMDB limit
      }
    } catch (err) {
      setError('Failed to load more movies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, type, searchQuery]);

  // What: Load initial movies
  useEffect(() => {
    const loadInitialMovies = async () => {
      setInitialLoading(true);
      setError(null);
      
      try {
        let data;
        
        if (searchQuery) {
          data = await movieAPI.searchMovies(searchQuery, 1);
        } else {
          switch(type) {
            case 'top-rated':
              data = await movieAPI.getTopRatedMovies(1);
              break;
            case 'upcoming':
              data = await movieAPI.getUpcomingMovies(1);
              break;
            case 'popular':
            default:
              data = await movieAPI.getPopularMovies(1);
              break;
          }
        }
        
        setMovies(data.results);
        setPage(1);
        setHasMore(data.total_pages > 1 && data.total_pages < 500);
      } catch (err) {
        setError('Failed to load movies');
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadInitialMovies();
  }, [type, searchQuery]);

  // What: Trigger load more when scrolled to bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreMovies();
    }
  }, [inView, hasMore, loading, loadMoreMovies]);

  if (initialLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
        <p className="text-center text-gray-400 mt-4">
          Loading your movies...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} />
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div ref={ref} className="py-8">
          <LoadingSpinner />
          <p className="text-center text-gray-400 mt-4">
            Loading more movies...
          </p>
        </div>
      )}

      {/* No More Movies */}
      {!hasMore && movies.length > 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-400">
            You've reached the end! 🎉
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {movies.length} movies loaded
          </p>
        </div>
      )}

      {/* Load More Trigger (invisible element) */}
      {hasMore && !loading && (
        <div ref={ref} className="h-10"></div>
      )}

      {/* Back to Top Button */}
      {movies.length > 20 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors z-40"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default InfiniteScrollMovies;