import axios from 'axios'

import { IConstants, IGameStat } from './../interfaces'
import { getRequestHeaders } from './../helpers/auth'

export const baseUrl = ApiBaseUrl

export const login = (payload: {username: string, password: string}): Promise<string> => {
  return axios.post(`${baseUrl}/login`, payload)
    .then((response) => {
      return response.data
    })
}

export const getGameStats = (): Promise<IGameStat[]> => {
  return axios.get(`${baseUrl}/games`, getRequestHeaders())
    .then((response) => {
      return response.data as IGameStat[]
    })
}

export const getBaseSettings = (): Promise<IConstants> => {
  return axios.get(`${baseUrl}/settings`, getRequestHeaders())
    .then((response) => {
      return response.data as IConstants
    })
}

export const createGame = (name?: string): Promise<string> => {
  return axios.post(`${baseUrl}/games`, { name }, getRequestHeaders())
    .then((response) => {
      return response.data.gameId as string
    })
}