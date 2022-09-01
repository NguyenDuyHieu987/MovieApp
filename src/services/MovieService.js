const axios = require('axios').default;
import {
  TMDB_BASE_URL,
  TMDB_API_KEY,
  TMDB_IMAGE_BASE_URL,
  ENDPOINTS,
  YOUTUBE_BASE_URL,
} from '../constants/Urls';
import LANGUAGES from '../constants/Languages';
import {
  nowPlayingRespone,
  upComingRespone,
  popularRespone,
  topRatedRespone,
  genreResponse,
} from '../JsonServer';

const TMDB_HTTP_REQUEST = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

const getTrending = () =>
  axios.get(
    'https://api.themoviedb.org/3/trending/all/day?api_key=fe1b70d9265fdb22caa86dca918116eb' +
      '&page=' +
      Math.floor(Math.random() * 1000)
  );

const getWathList = () =>
  axios.get(
    `https://api.themoviedb.org/3/account/14271386/watchlist/movies?api_key=fe1b70d9265fdb22caa86dca918116eb&language=en-US&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d&sort_by=created_at.asc&`
  );

const getWathListPage = (page) =>
  axios.get(
    `https://api.themoviedb.org/3/account/14271386/watchlist/movies?api_key=fe1b70d9265fdb22caa86dca918116eb&language=en-US&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d&sort_by=created_at.asc&page=${page}`
  );

const getNowPlayingMovies = () =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.NOW_PLAYING_MOVIES);

const getUpcomingMovies = () =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.UPCOMING_MOVIES);

const getPopularMovies = () => TMDB_HTTP_REQUEST.get(ENDPOINTS.POPULAR);

const getTopRatedMovies = () => TMDB_HTTP_REQUEST.get(ENDPOINTS.TOPRATED);

// const getMovieById = (movieId, append_to_response = '') =>
//   TMDB_HTTP_REQUEST.get(
//     `${ENDPOINTS.MOVIE}/${movieId}`,
//     append_to_response ? { params: { append_to_response } } : null
//   );

// const getMovieByIdSimilarRecommend = (movieId, append_to_response = '') =>
//   TMDB_HTTP_REQUEST.get(
//     `${ENDPOINTS.MOVIE}/${movieId}`,
//     append_to_response ? { params: { append_to_response } } : null
//   );

// getMovieById(616037, 'credits, videos, recommendations, similar').then((a) =>
//   console.log(a.data.credits.cast)
// );

const getMovieById = (movieId, append_to_response) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=fe1b70d9265fdb22caa86dca918116eb&append_to_response=${append_to_response}`
  );

const getMovieByCredit = (movieId, append_to_response) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=fe1b70d9265fdb22caa86dca918116eb&append_to_response=${append_to_response}`
  );

const getMovieBySimilar = (movieId, append_to_response) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=fe1b70d9265fdb22caa86dca918116eb&append_to_response=${append_to_response}`
  );

const getMovieByRecommend = (movieId, append_to_response) =>
  axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=fe1b70d9265fdb22caa86dca918116eb&append_to_response=${append_to_response}`
  );

const getAllGenres = () => TMDB_HTTP_REQUEST.get(ENDPOINTS.GENRES);

const getPoster = (path) => `${TMDB_IMAGE_BASE_URL}/original${path}`;

const getVideo = (key) => `${YOUTUBE_BASE_URL}?v=${key}`;

const getIdGenresByName = (genres_name) =>
  genreResponse.genres.find((gen) => (gen.name == genres_name ? gen : null));

var a = [];

const getMoviesByGenres = (movies, genres_name) => {
  movies.map((movie) => {
    for (let i = 0; i <= movie.genre_ids.length; i++) {
      if (movie.genre_ids[i] === getIdGenresByName(genres_name).id) {
        a = [...a, movie];
      }
    }
  });
  return a;
};

var b = [];

const getMoviesByGenres2 = (movies, genres_name) => {
  movies.map((movie) => {
    for (let i = 0; i <= movie.genre_ids.length; i++) {
      if (movie.genre_ids[i] === getIdGenresByName(genres_name).id) {
        b = [...b, movie];
      }
    }
  });
  return b;
};
var c = [];

var getMoviesByGenres3 = (movies, genres_name) => {
  movies.map((movie) => {
    for (let i = 0; i <= movie.genre_ids.length; i++) {
      if (movie.genre_ids[i] === getIdGenresByName(genres_name).id) {
        c = [...c, movie];
      }
    }
  });
  return c;
};
var d = [];

var getMoviesByGenres4 = (movies, genres_name) => {
  movies.map((movie) => {
    for (let i = 0; i <= movie.genre_ids.length; i++) {
      if (movie.genre_ids[i] === getIdGenresByName(genres_name).id) {
        d = [...d, movie];
      }
    }
  });
  return d;
};
const getLanguage = (language_iso) =>
  LANGUAGES.find((language) => language.iso_639_1 === language_iso);

export {
  getNowPlayingMovies,
  getUpcomingMovies,
  getAllGenres,
  getMovieById,
  getPoster,
  getLanguage,
  getVideo,
  getPopularMovies,
  getTopRatedMovies,
  getMovieByCredit,
  getMovieBySimilar,
  getMovieByRecommend,
  getTrending,
  getWathList,
  getWathListPage,
  getMoviesByGenres,
  getIdGenresByName,
  getMoviesByGenres2,
  getMoviesByGenres3,
  getMoviesByGenres4,
};
