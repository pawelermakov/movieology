import { Request } from 'express'

export interface SearchRequest extends Request {
  query: {
    searchTerm: string
  }
}

export interface GetMovieFromIMDBRequest extends Request {
  params: {
    IMDBId: string
  }
}

export interface CreateMovieRequest extends Request {
  body: Movie
}

export interface UpdateMovieRequest extends Request {
  body: Partial<Movie>
  params: {
    id: string
  }
}

export interface DeleteMovieRequest extends Request {
  params: {
    id: string
  }
}

export interface GetMovieRequest extends Request {
  params: {
    id: string
  }
}

export interface MagnetRequest extends Request {
  query: {
    magnetUrl: string
  }
}

export interface Movie {
  title: string
  magnet: string
  fileName: string
  sourceUrl: string
  plot: string
  year: string
  director: string
  actors: string[]
  poster: string
  trailer: string
  _id?: string
  boxOffice: string
  released: string
  writer: string
  runtime: string
  ratingImdb: string
  imdbId: string
  rated: string
  genres: string[]
}
