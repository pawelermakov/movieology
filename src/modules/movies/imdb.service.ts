import axios from 'axios'
import { stringify } from 'qs'
import { IMDB_SEARCH_URL } from './movies.const'

export const searchInIMDB = async query => {
  const queryParms = stringify({
    language: 'ru',
    api_key: process.env.IMDB_API_KEY,
    query
  })

  const {
    data: { results }
  } = await axios.get(`${IMDB_SEARCH_URL}/search/movie?${queryParms}`)

  const [movie] = results

  return movie
}

export const getMovieFromIMDB = async (IMDBId: string) => {
  const queryParms = stringify({
    language: 'ru',
    api_key: process.env.IMDB_API_KEY
  })

  const result = await axios.get(`${IMDB_SEARCH_URL}/movie/${IMDBId}?${queryParms}`)

  return result.data
}
