import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // What: Fetch movie details
  // Why: Show comprehensive movie information
  // When: Component mounts with movie ID
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await movieAPI.getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        navigate('/'); // Redirect to home if movie not found
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!movie) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Backdrop Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={movieAPI.getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
        >
          ← Back
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-48 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3">
            <img
              src={movieAPI.getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>

          {/* Movie Info */}
          <div className="md:w-2/3 py-8">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            
            {/* Rating and Release Date */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded-full">
                  ⭐ {movie.vote_average.toFixed(1)}
                </div>
                <span className="text-gray-300">/10</span>
              </div>
              
              <div className="text-gray-300">
                📅 {new Date(movie.release_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="text-gray-300">
                ⏱️ {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-red-600 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-xl italic text-gray-300 mb-6">"{movie.tagline}"</p>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800 bg-opacity-50 p-6 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Status</h3>
                <p>{movie.status}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Original Language</h3>
                <p>{movie.original_language.toUpperCase()}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Budget</h3>
                <p>${movie.budget.toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-400 mb-2">Revenue</h3>
                <p>${movie.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;