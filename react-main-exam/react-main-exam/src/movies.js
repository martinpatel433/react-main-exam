export const sampleMovies = [
  {
    id: 693134,
    title: 'Dune: Part Two',
    year: '2024',
    release_date: '2024-02-27',
    rating: 8.5,
    genre: 'Sci-Fi',
    genres: ['Science Fiction', 'Adventure'],
    language: 'English',
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster:
      'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    year: '2023',
    release_date: '2023-07-19',
    rating: 8.1,
    genre: 'Drama',
    genres: ['Drama', 'History'],
    language: 'English',
    overview:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    poster:
      'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    year: '2023',
    release_date: '2023-05-31',
    rating: 8.4,
    genre: 'Animation',
    genres: ['Animation', 'Action', 'Adventure'],
    language: 'English',
    overview:
      'Miles Morales catapults across the multiverse, where he meets a team of Spider-People charged with protecting its existence.',
    poster:
      'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry'],
  },
  {
    id: 414906,
    title: 'The Batman',
    year: '2022',
    release_date: '2022-03-01',
    rating: 7.7,
    genre: 'Action',
    genres: ['Crime', 'Mystery', 'Thriller'],
    language: 'English',
    overview:
      'Batman ventures into Gotham City’s underworld when a sadistic killer leaves behind a trail of cryptic clues.',
    poster:
      'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano'],
  },
  {
    id: 545611,
    title: 'Everything Everywhere All at Once',
    year: '2022',
    release_date: '2022-03-24',
    rating: 7.8,
    genre: 'Adventure',
    genres: ['Action', 'Adventure', 'Science Fiction'],
    language: 'English',
    overview:
      'An exhausted Chinese American woman is swept up in an adventure where she alone can save the world by exploring other universes.',
    poster:
      'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/ss0Os3uWJfQAENILHZUdX8Tt1OC.jpg',
    cast: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan'],
  },
  {
    id: 157336,
    title: 'Interstellar',
    year: '2014',
    release_date: '2014-11-05',
    rating: 8.7,
    genre: 'Sci-Fi',
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    language: 'English',
    overview:
      'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.',
    poster:
      'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
  },
  {
    id: 666277,
    title: 'Past Lives',
    year: '2023',
    release_date: '2023-06-02',
    rating: 7.8,
    genre: 'Romance',
    genres: ['Drama', 'Romance'],
    language: 'Korean, English',
    overview:
      'Two deeply connected childhood friends are wrested apart after one family emigrates from South Korea.',
    poster:
      'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/4fLZUr1e65hKPPVw0R3PmKFKxj1.jpg',
    cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
  },
  {
    id: 120467,
    title: 'The Grand Budapest Hotel',
    year: '2014',
    release_date: '2014-02-26',
    rating: 8.0,
    genre: 'Comedy',
    genres: ['Comedy', 'Drama'],
    language: 'English',
    overview:
      'A legendary concierge and his trusted protégé become wrapped up in the theft of a priceless painting.',
    poster:
      'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    backdrop:
      'https://image.tmdb.org/t/p/w1280/n1hqbSCtyBAxaXEl1Dj3ipXJAJG.jpg',
    cast: ['Ralph Fiennes', 'Tony Revolori', 'Saoirse Ronan'],
  },
]

const genreNames = {
  12: 'Adventure',
  18: 'Drama',
  28: 'Action',
  35: 'Comedy',
  878: 'Science Fiction',
  10749: 'Romance',
}

export function normalizeMovie(movie) {
  const movieGenres = movie.genres?.map((genre) =>
    typeof genre === 'string' ? genre : genre.name,
  ) || movie.genre_ids?.map((id) => genreNames[id]).filter(Boolean) || []

  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date?.slice(0, 4) || '—',
    release_date: movie.release_date || '',
    rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 0,
    genre: movie.genre || movieGenres[0] || 'Movie',
    genres: movieGenres,
    language: movie.spoken_languages?.map((language) => language.english_name || language.name).join(', ')
      || movie.language
      || movie.original_language?.toUpperCase()
      || '—',
    overview: movie.overview || 'No description is available for this movie yet.',
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : movie.poster || '',
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : movie.backdrop || '',
    cast: movie.cast || [],
  }
}
