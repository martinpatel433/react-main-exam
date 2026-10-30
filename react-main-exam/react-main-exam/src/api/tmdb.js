import axios from 'axios'
import { normalizeMovie } from '../movies'

const accessToken = import.meta.env.VITE_TMDB_API_KEY

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  params: { language: 'en-US' },
})

export async function getPopularMovies(signal) {
  const { data } = await tmdb.get('/movie/popular', { signal })
  return (data.results || []).map(normalizeMovie)
}

export async function findMovies(query, signal) {
  const { data } = await tmdb.get('/search/movie', {
    params: { query, include_adult: false },
    signal,
  })
  return (data.results || []).map(normalizeMovie)
}

export async function getMovieDetails(movieId, signal) {
  const { data } = await tmdb.get(`/movie/${movieId}`, {
    params: { append_to_response: 'credits' },
    signal,
  })

  return {
    ...normalizeMovie(data),
    genres: data.genres?.map((genre) => genre.name) || [],
    language: data.spoken_languages?.map((language) => language.english_name || language.name).join(', ')
      || data.original_language?.toUpperCase()
      || '—',
    cast: data.credits?.cast?.slice(0, 6).map((person) => person.name) || [],
  }
}

export function getApiError(error) {
  return error.response?.data?.status_message || error.message || 'The movie service is unavailable.'
}

export const hasTmdbToken = Boolean(accessToken)
