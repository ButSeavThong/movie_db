import axios from 'axios';

// NOTE: You should use environment variables in production
// Create a .env file and add: REACT_APP_TMDB_API_KEY=your_api_key_here
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || '6fe156bfd1991bfef6c21c77d6349998';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Why we use axios: 
// - Better error handling
// - Automatic JSON parsing
// - Request/response interceptors
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// What: Movie API functions
// Why: Encapsulate API logic for reusability
export const movieAPI = {
getPopularMovies: async (page = 1) => {
    try {
      const response = await api.get('/movie/popular', { 
        params: { page, language: 'en-US' } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await api.get('/movie/top_rated', { 
        params: { page, language: 'en-US' } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await api.get('/movie/upcoming', { 
        params: { page, language: 'en-US' } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  searchMovies: async (query, page = 1) => {
    try {
      const response = await api.get('/search/movie', { 
        params: { 
          query, 
          page,
          language: 'en-US',
          include_adult: false 
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // How: Get movie details by ID
  getMovieDetails: async (id) => {
    try {
      const response = await api.get(`/movie/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Helper function to get full image URL
  getImageUrl: (path, size = 'w500') => {
    return path 
      ? `${IMAGE_BASE_URL}/${size}${path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';
  },
};