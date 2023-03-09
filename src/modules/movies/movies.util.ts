import axios from 'axios'
import { parse } from 'qs'
import { MAGNET_KEY, SPLIT_MAGNET_STRING } from './movies.const'

export const extractMagnetFromQuery = async (query: string) => {
  const magnetResult = await axios.get(`http://localhost:8080/movies/magnet?magnetUrl=${query}`)
  const parsedMagnetResult = parse(magnetResult.data)
  return String(parsedMagnetResult[MAGNET_KEY]).replace(SPLIT_MAGNET_STRING, '')
}
