import { Request } from 'express'

export interface SearchRequest extends Request {
  query: {
    searchTerm: string
  }
}

export interface MagnetRequest extends Request {
  query: {
    magnetUrl: string
  }
}
