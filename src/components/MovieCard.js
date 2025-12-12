import React from 'react';
import { Link } from 'react-router-dom';
import { movieAPI } from '../services/api';

const MovieCard = ({ movie }) => {
  // What: Format release date to readable format
  // Why: Better user experience than raw date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Poster Image */}
        <div className="relative pt-[150%] overflow-hidden">
          <img
            src={movieAPI.getImageUrl(movie.poster_path, 'w500')}
            alt={movie.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 font-bold px-2 py-1 rounded-full text-sm">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg truncate" title={movie.title}>
            {movie.title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {formatDate(movie.release_date)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;