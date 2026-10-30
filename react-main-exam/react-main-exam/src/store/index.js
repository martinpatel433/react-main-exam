import { applyMiddleware, createStore } from 'redux'
import { thunk } from 'redux-thunk'
import { sampleMovies } from '../movies'
import { findMovies, getApiError, getMovieDetails, getPopularMovies, hasTmdbToken } from '../api/tmdb'

const MOVIES_REQUEST = 'movies/request'
const MOVIES_SUCCESS = 'movies/success'
const MOVIES_FAILURE = 'movies/failure'
const MOVIES_CANCEL = 'movies/cancel'
const DETAILS_REQUEST = 'details/request'
const DETAILS_SUCCESS = 'details/success'
const DETAILS_FAILURE = 'details/failure'
const DETAILS_CANCEL = 'details/cancel'
const FAVORITE_TOGGLE = 'favorites/toggle'
const USER_SIGN_IN = 'user/signIn'
const USER_SIGN_OUT = 'user/signOut'

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const initialState = {
  movies: sampleMovies,
  library: sampleMovies,
  favorites: Array.isArray(readStorage('framebyframe-watchlist', []))
    ? readStorage('framebyframe-watchlist', [])
    : [],
  user: readStorage('framebyframe-user', null),
  loading: false,
  error: '',
  details: null,
  detailsLoading: false,
  detailsError: '',
}

function movieReducer(state = initialState, action) {
  switch (action.type) {
    case MOVIES_REQUEST:
      return { ...state, loading: true, error: '' }
    case MOVIES_SUCCESS: {
      const byId = new Map(state.library.map((movie) => [movie.id, movie]))
      action.movies.forEach((movie) => byId.set(movie.id, movie))
      return { ...state, loading: false, movies: action.movies, library: [...byId.values()] }
    }
    case MOVIES_FAILURE:
      return { ...state, loading: false, error: action.error }
    case MOVIES_CANCEL:
      return { ...state, loading: false }
    case DETAILS_REQUEST:
      return { ...state, details: null, detailsLoading: true, detailsError: '' }
    case DETAILS_SUCCESS:
      return { ...state, details: action.movie, detailsLoading: false }
    case DETAILS_FAILURE:
      return { ...state, detailsLoading: false, detailsError: action.error }
    case DETAILS_CANCEL:
      return { ...state, detailsLoading: false }
    case FAVORITE_TOGGLE: {
      const favorites = state.favorites.includes(action.movieId)
        ? state.favorites.filter((id) => id !== action.movieId)
        : [...state.favorites, action.movieId]
      return { ...state, favorites }
    }
    case USER_SIGN_IN:
      return { ...state, user: action.user }
    case USER_SIGN_OUT:
      return { ...state, user: null }
    default:
      return state
  }
}

export function fetchPopularMovies(signal) {
  return async (dispatch) => {
    if (!hasTmdbToken) return
    dispatch({ type: MOVIES_REQUEST })
    try {
      dispatch({ type: MOVIES_SUCCESS, movies: await getPopularMovies(signal) })
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        dispatch({ type: MOVIES_CANCEL })
      } else {
        dispatch({ type: MOVIES_FAILURE, error: getApiError(error) })
      }
    }
  }
}

export function searchMovies(query, signal) {
  return async (dispatch) => {
    if (!hasTmdbToken || !query.trim()) return
    dispatch({ type: MOVIES_REQUEST })
    try {
      dispatch({ type: MOVIES_SUCCESS, movies: await findMovies(query.trim(), signal) })
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        dispatch({ type: MOVIES_CANCEL })
      } else {
        dispatch({ type: MOVIES_FAILURE, error: getApiError(error) })
      }
    }
  }
}

export function fetchMovieDetails(movie, signal) {
  return async (dispatch) => {
    if (!hasTmdbToken) return
    dispatch({ type: DETAILS_REQUEST })
    try {
      dispatch({ type: DETAILS_SUCCESS, movie: await getMovieDetails(movie.id, signal) })
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        dispatch({ type: DETAILS_CANCEL })
      } else {
        dispatch({ type: DETAILS_FAILURE, error: getApiError(error) })
      }
    }
  }
}

export function toggleFavorite(movieId) {
  return (dispatch, getState) => {
    dispatch({ type: FAVORITE_TOGGLE, movieId })
    localStorage.setItem('framebyframe-watchlist', JSON.stringify(getState().favorites))
  }
}

export function signIn(user) {
  return (dispatch) => {
    localStorage.setItem('framebyframe-user', JSON.stringify(user))
    dispatch({ type: USER_SIGN_IN, user })
  }
}

export function signOut() {
  return (dispatch) => {
    localStorage.removeItem('framebyframe-user')
    dispatch({ type: USER_SIGN_OUT })
  }
}

export const store = createStore(movieReducer, applyMiddleware(thunk))
