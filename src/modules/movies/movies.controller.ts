import { Router } from 'express'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { parse } from 'qs'
import { MagnetRequest, SearchRequest } from './movies.interfaces'
import fetch from 'node-fetch'

const router = Router()

const RUTOR_URL = 'https://rutor.org'
const BASE_SEARCH_URL = 'https://rutor.org/search/1/0/000/0'
const MAGNET_KEY = 'magnet:?xt'
const SPLIT_MAGNET_STRING = 'urn:btih:'
router.get('/search', async ({ query: { searchTerm } }: SearchRequest, res) => {
  try {
    const searchResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
    const $ = cheerio.load(searchResult.data)

    const data = $('#index tr').slice(1).toArray()

    const results = await Promise.all(
      data.map(async item => {
        const [_, magnetTag, title] = $(item).find('a').toArray()

        const magnetLink = $(magnetTag).attr('href')
        const magnetResult = await axios.get(`http://localhost:8080/movies/magnet?magnetUrl=${magnetLink}`)
        const parsedMagnetResult = parse(magnetResult.data)
        const magnet = String(parsedMagnetResult[MAGNET_KEY]).replace(SPLIT_MAGNET_STRING, '')

        const torrentUrl = `${RUTOR_URL}${$(title).attr('href')}`

        return {
          magnet,
          title: $(title).text(),
          torrentUrl: torrentUrl
        }
      })
    )

    res.status(200).send(results)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/magnet', async ({ query: { magnetUrl } }: MagnetRequest, res) => {
  try {
    const response = await fetch(magnetUrl, { redirect: 'manual' })

    if (response.status === 301 || response.status === 302) {
      const magnetLink = new URL(response.headers.get('location'), response.url)

      res.status(200).send(magnetLink)
    }
  } catch (err) {
    res.status(400).send(err)
  }
})

export default router
