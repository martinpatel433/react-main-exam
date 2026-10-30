# Frame by Frame

A responsive movie discovery and watchlist app built with React, Vite, Redux, React Router, Axios, and Bootstrap.

## Run locally

```bash
npm install
npm run dev
```

The app works immediately with curated sample movies. To enable live popular movies, search, movie details, and cast data:

1. Create a TMDb account and generate a v4 read access token in your account settings.
2. Copy `.env.example` to `.env.local` and set `VITE_TMDB_API_KEY` to your token.
3. Restart the Vite development server.

Vite exposes `VITE_` variables in browser code. Use a development token for this demo; a production app should make TMDb requests through a backend so the token is not exposed.

## Features

- Discover popular movies and search titles as you type.
- View movie descriptions, ratings, release dates, languages, genres, and cast.
- Filter by genre and save movies to a watchlist persisted in `localStorage`.
- Demo sign-in/profile stored in `localStorage`. This is a UI demonstration, not secure authentication.
- Redux reducers and thunks manage movie requests, details, errors, watchlist, and the demo profile.
- Responsive navigation, loading indicators, readable errors, and a curated no-key fallback.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
