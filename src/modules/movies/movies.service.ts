import { Router } from 'express'
import * as cheerio from 'cheerio'
import axios from 'axios'
import MovieEntity from './movies.model'
import { Movie } from './movies.interfaces'
import { BASE_SEARCH_URL, RUTOR_URL } from './movies.const'
import { extractMagnetFromQuery } from './movies.util'

const router = Router()

export const movieSearch = async (searchTerm: string) => {
  const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
  const $ = cheerio.load(searchResult.data)

  const data = $('#index tr').slice(1).toArray()

  return await Promise.all(
    data.map(async item => {
      const [_, magnetTag, title] = $(item).find('a').toArray()

      const magnetLink = $(magnetTag).attr('href')
      const magnet = await extractMagnetFromQuery(magnetLink)

      const torrentUrl = `${RUTOR_URL}${$(title).attr('href')}`

      return {
        magnet: magnet,
        title: $(title).text(),
        torrentUrl: torrentUrl
      }
    })
  )
}

export const create = async (input: Movie) => {
  const item = new MovieEntity(input)
  await item.save()
  return item
}

export const update = (input: Partial<Movie>, id: string) => {
  return MovieEntity.findByIdAndUpdate(id, input, {
    new: true
  })
}

export const findOne = (id: string) => {
  return MovieEntity.findById(id)
}

export const findAll = () => {
  return MovieEntity.find()
}

export const deleteOne = (id: string) => {
  return MovieEntity.findByIdAndRemove(id)
}
