import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { sampleMovies } from './movies'
import { fetchMovieDetails, fetchPopularMovies, searchMovies, signIn, signOut, toggleFavorite } from './store'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

const apiKey = import.meta.env.VITE_TMDB_API_KEY
const navigation = [
  { id: 'popular', path: '/', label: 'Discover' },
  { id: 'search', path: '/search', label: 'Search' },
  { id: 'watchlist', path: '/watchlist', label: 'My watchlist' },
]
const genres = ['All films', 'Action', 'Adventure', 'Drama', 'Sci-Fi', 'Comedy', 'Romance']

function Navbar({ activeTab, onNavigate, user, onSignIn, onSignOut }) {
  return (
    <header className="topbar">
      <a className="brand" href="#" onClick={(event) => {
        event.preventDefault()
        onNavigate('popular')
      }}>
        <span className="brand-mark">f</span>
        <span>frame<span className="brand-light">by</span>frame</span>
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <button
            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
            key={item.id}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="account-area">
        {user ? (
          <>
            <button className="avatar-button" onClick={() => onNavigate('profile')} aria-label="Open profile">
              {user.name.slice(0, 1).toUpperCase()}
            </button>
            <button className="sign-out" onClick={onSignOut}>Sign out</button>
          </>
        ) : (
          <button className="sign-in-button" onClick={onSignIn}>Sign in <span aria-hidden="true">↗</span></button>
        )}
      </div>
    </header>
  )
}

function MovieCard({ movie, isFavorite, onSelect, onToggleFavorite }) {
  return (
    <article className="movie-card">
      <button className="poster-button" onClick={() => onSelect(movie)} aria-label={`View ${movie.title} details`}>
        {movie.poster ? (
          <img className="poster" src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <span className="poster-placeholder">🎬</span>
        )}
        <span className="poster-rating"><span aria-hidden="true">★</span> {movie.rating || '—'}</span>
      </button>
      <button
        className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
        onClick={() => onToggleFavorite(movie.id)}
        aria-label={`${isFavorite ? 'Remove' : 'Add'} ${movie.title} ${isFavorite ? 'from' : 'to'} watchlist`}
        aria-pressed={isFavorite}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <button className="movie-card-info" onClick={() => onSelect(movie)}>
        <span className="movie-title">{movie.title}</span>
        <span className="movie-meta">{movie.year} <i /> {movie.genre}</span>
      </button>
    </article>
  )
}

function MovieDetails({ movie, onClose, isFavorite, onToggleFavorite }) {
  const [apiDetails, setApiDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const details = apiDetails || movie

  useEffect(() => {
    if (!apiKey) return undefined

    const controller = new AbortController()
    async function fetchDetails() {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits&language=en-US`,
          { headers: { Authorization: `Bearer ${apiKey}` }, signal: controller.signal },
        )
        if (!response.ok) throw new Error('Movie details could not be loaded. Please try again.')
        const result = await response.json()
        setApiDetails({
          ...normalizeMovie(result),
          genres: result.genres?.map((genre) => genre.name) || movie.genres,
          cast: result.credits?.cast?.slice(0, 4).map((person) => person.name) || [],
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchDetails()
    return () => controller.abort()
  }, [movie])

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
        <div
          className="details-backdrop"
          style={{ backgroundImage: details.backdrop ? `url("${details.backdrop}")` : undefined }}
        />
        <div className="details-content">
          <img className="details-poster" src={details.poster} alt={`${details.title} poster`} />
          <div className="details-copy">
            <p className="eyebrow">MOVIE DETAILS</p>
            <h2 id="details-title">{details.title}</h2>
            <div className="details-meta">
              <span>{details.year}</span><span className="gold">★ {details.rating || '—'}</span>
              <span>{details.language}</span>
            </div>
            {loading && <p className="inline-status">Loading credits…</p>}
            {error && <p className="inline-error" role="alert">{error}</p>}
            <p className="details-overview">{details.overview}</p>
            <p className="detail-label">GENRES</p>
            <div className="genre-tags">
              {(details.genres.length ? details.genres : [details.genre]).map((genre) => (
                <span className="genre-tag" key={genre}>{genre}</span>
              ))}
            </div>
            <p className="detail-label cast-label">CAST</p>
            <p className="cast-list">{details.cast.length ? details.cast.join(' · ') : 'Cast details available with TMDb API'}</p>
            <button
              className={`watchlist-action ${isFavorite ? 'saved' : ''}`}
              onClick={() => onToggleFavorite(movie.id)}
            >
              {isFavorite ? '♥  In your watchlist' : '♡  Add to watchlist'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function SignInModal({ onClose, onSignIn }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function submit(event) {
    event.preventDefault()
    onSignIn({ name: name.trim(), email: email.trim() })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="signin-modal" role="dialog" aria-modal="true" aria-labelledby="signin-title">
        <button className="modal-close" onClick={onClose} aria-label="Close sign in">×</button>
        <span className="brand-mark signin-mark">f</span>
        <p className="eyebrow">YOUR PERSONAL CINEMA</p>
        <h2 id="signin-title">Make it yours.</h2>
        <p className="signin-description">Sign in to keep your watchlist close. This demo saves your profile on this device.</p>
        <form className="signin-form" onSubmit={submit}>
          <label htmlFor="signin-name">Your name</label>
          <input id="signin-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Alex Morgan" required autoFocus />
          <label htmlFor="signin-email">Email address</label>
          <input id="signin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
          <button className="primary-button signin-submit" type="submit">Continue <span aria-hidden="true">→</span></button>
        </form>
      </section>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('popular')
  const [query, setQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All films')
  const [movies, setMovies] = useState(sampleMovies)
  const [movieLibrary, setMovieLibrary] = useState(sampleMovies)
  const [favorites, setFavorites] = useState(() => readStorage('framebyframe-watchlist', []))
  const [user, setUser] = useState(() => readStorage('framebyframe-user', null))
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showSignIn, setShowSignIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('framebyframe-watchlist', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (!apiKey) {
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      const endpoint = query.trim()
        ? `search/movie?query=${encodeURIComponent(query.trim())}&include_adult=false&language=en-US&page=1`
        : 'movie/popular?language=en-US&page=1'
      try {
        const response = await fetch(`https://api.themoviedb.org/3/${endpoint}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('Movies could not be loaded. Check your TMDb API key and try again.')
        const result = await response.json()
        const fetchedMovies = (result.results || []).map(normalizeMovie)
        setMovies(fetchedMovies)
        setMovieLibrary((current) => {
          const byId = new Map(current.map((movie) => [movie.id, movie]))
          fetchedMovies.forEach((movie) => byId.set(movie.id, movie))
          return [...byId.values()]
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, query.trim() ? 350 : 0)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const filteredMovies = useMemo(() => {
    if (apiKey) return movies
    const searchTerm = query.trim().toLowerCase()
    return sampleMovies.filter((movie) =>
      !searchTerm || `${movie.title} ${movie.genre} ${movie.year}`.toLowerCase().includes(searchTerm),
    )
  }, [movies, query])

  const visibleMovies = useMemo(() => {
    let result = activeTab === 'watchlist'
      ? movieLibrary.filter((movie) => favorites.includes(movie.id))
      : filteredMovies
    if (selectedGenre !== 'All films') {
      result = result.filter((movie) =>
        movie.genre === selectedGenre || movie.genres?.includes(selectedGenre) ||
        (selectedGenre === 'Sci-Fi' && movie.genres?.includes('Science Fiction')),
      )
    }
    return result
  }, [activeTab, favorites, filteredMovies, movieLibrary, selectedGenre])

  const isSearch = activeTab === 'search' || query.length > 0
  const heading = activeTab === 'watchlist'
    ? 'Your watchlist'
    : isSearch
      ? query.trim() ? `Results for “${query.trim()}”` : 'Find your next favorite'
      : activeTab === 'profile'
        ? 'Your profile'
        : 'Popular right now'

  function navigate(tab) {
    setActiveTab(tab)
    if (tab !== 'search') setQuery('')
    setSelectedGenre('All films')
  }

  function toggleFavorite(movieId) {
    setFavorites((current) =>
      current.includes(movieId) ? current.filter((id) => id !== movieId) : [...current, movieId],
    )
  }

  function signIn(profile) {
    setUser(profile)
    localStorage.setItem('framebyframe-user', JSON.stringify(profile))
    setShowSignIn(false)
    setActiveTab('profile')
  }

  function signOut() {
    localStorage.removeItem('framebyframe-user')
    setUser(null)
    setActiveTab('popular')
  }

  const featuredMovie = sampleMovies[0]

  return (
    <div className="app-shell">
      <Navbar
        activeTab={activeTab}
        onNavigate={navigate}
        user={user}
        onSignIn={() => setShowSignIn(true)}
        onSignOut={signOut}
      />
      <main>
        {activeTab === 'profile' ? (
          <section className="profile-page">
            <p className="eyebrow">YOUR SPACE</p>
            <h1>{heading}</h1>
            {user ? (
              <div className="profile-card">
                <span className="profile-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
                <div><h2>{user.name}</h2><p>{user.email}</p></div>
                <div className="profile-stat"><strong>{favorites.length}</strong><span>saved films</span></div>
                <button className="text-button" onClick={() => navigate('watchlist')}>View watchlist →</button>
              </div>
            ) : (
              <div className="empty-state profile-empty">
                <span className="empty-icon">✦</span><h2>A little more personal.</h2>
                <p>Sign in to create your profile and keep your favorite films in one place.</p>
                <button className="primary-button" onClick={() => setShowSignIn(true)}>Sign in <span aria-hidden="true">→</span></button>
              </div>
            )}
          </section>
        ) : (
          <>
            {activeTab === 'popular' && !query && (
              <section className="hero">
                <div className="hero-image" />
                <div className="hero-content">
                  <p className="eyebrow hero-eyebrow"><span /> THE FILM EVERYONE’S TALKING ABOUT</p>
                  <h1>Stories that<br />stay with you.</h1>
                  <p className="hero-description">Find your next favorite, revisit an old one, and keep a list of what’s worth watching.</p>
                  <div className="hero-actions">
                    <button className="primary-button" onClick={() => setSelectedMovie(featuredMovie)}>Explore the film <span aria-hidden="true">↗</span></button>
                    <button className="hero-watchlist" onClick={() => toggleFavorite(featuredMovie.id)}>
                      {favorites.includes(featuredMovie.id) ? '♥ Saved to watchlist' : '♡ Add to watchlist'}
                    </button>
                  </div>
                  <div className="featured-credit"><span>01</span><i /> {featuredMovie.title} <span className="credit-year">2024 · Sci-Fi</span></div>
                </div>
                <div className="hero-side-note">A GOOD FILM<br />IS NEVER JUST A FILM</div>
              </section>
            )}
            <section className="catalog-section">
              <div className="catalog-heading">
                <div>
                  <p className="eyebrow">{activeTab === 'watchlist' ? 'PICK UP WHERE YOU LEFT OFF' : isSearch ? 'THE RIGHT FILM IS OUT THERE' : 'A FEW WORTH YOUR TIME'}</p>
                  <h2>{heading}<span className="heading-period">.</span></h2>
                </div>
                <div className="catalog-count">{visibleMovies.length.toString().padStart(2, '0')} <span>FILMS</span></div>
              </div>
              <div className="catalog-controls">
                <div className="genre-filters" aria-label="Filter by genre">
                  {genres.map((genre) => (
                    <button
                      className={`genre-filter ${selectedGenre === genre ? 'selected' : ''}`}
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                <div className="search-field">
                  <span className="search-icon" aria-hidden="true">⌕</span>
                  <input
                    type="search"
                    placeholder="Search films..."
                    value={query}
                    onFocus={() => setActiveTab('search')}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search films"
                  />
                  {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
                </div>
              </div>
              {error && <p className="error-banner" role="alert">{error}</p>}
              {loading ? (
                <div className="loading-state"><span className="spinner" /> Finding your films…</div>
              ) : visibleMovies.length ? (
                <div className="movie-grid">
                  {visibleMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isFavorite={favorites.includes(movie.id)}
                      onSelect={setSelectedMovie}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">{activeTab === 'watchlist' ? '♡' : '⌕'}</span>
                  <h3>{activeTab === 'watchlist' ? 'Your list is still a blank page.' : 'No films found.'}</h3>
                  <p>{activeTab === 'watchlist' ? 'Save a film you love and it’ll be waiting here.' : 'Try another title or choose a different genre.'}</p>
                  {activeTab === 'watchlist' && <button className="text-button" onClick={() => navigate('popular')}>Explore films →</button>}
                </div>
              )}
              <footer className="catalog-footer">
                <span>GOOD FILMS. GOOD COMPANY.</span>
                <span>{apiKey ? 'MOVIE DATA BY TMDB' : 'A CURATED LITTLE COLLECTION'}</span>
              </footer>
            </section>
          </>
        )}
      </main>
      {selectedMovie && (
        <MovieDetails
          key={selectedMovie.id}
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={favorites.includes(selectedMovie.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} onSignIn={signIn} />}
    </div>
  )
}

export default App
