import { Router } from 'express'
import * as MovieService from './movies.service'
import * as IMDBService from './imdb.service'
import { CreateMovieRequest, MagnetRequest, SearchRequest } from './movies.interfaces'
import fetch from 'node-fetch'

const router = Router()

router.get('/search', async ({ query: { searchTerm } }: SearchRequest, res) => {
  try {
    const results = await MovieService.movieSearch(searchTerm)

    res.status(200).send(results)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/imdb-search', async ({ query: { searchTerm } }: SearchRequest, res) => {
  try {
    const results = await IMDBService.searchInIMDB(searchTerm)

    res.status(200).send(results)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/imdb/:IMDBId', async ({ params: { IMDBId } }: SearchRequest, res) => {
  try {
    const results = await IMDBService.getMovieFromIMDB(IMDBId)

    res.status(200).send(results)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post('/', async ({ body }: CreateMovieRequest, res) => {
  try {
    const result = await MovieService.create(body)

    res.status(200).send(result)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get('/', async (_, res) => {
  try {
    const results = await MovieService.findAll()

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
