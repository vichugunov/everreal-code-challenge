import axios from 'axios'

import { IConstants, IGameMove, IGameStat, IGameSetup } from './../interfaces'
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

export const makeMove = (gameId: string, color: string): Promise<IGameMove> => {
  return axios.post(`${baseUrl}/games/${gameId}/move`, { color }, getRequestHeaders())
    .then((response) => {
      return response.data as IGameMove
    })
}

export const solveAi = (gameId: string): Promise<IGameMove[]> => {
  return axios.get(`${baseUrl}/games/${gameId}/ai-solution-steps`, getRequestHeaders())
    .then((response) => {
      return response.data.moves as IGameMove[]
    })
}

export const getGameHistory = (gameId: string): Promise<IGameMove[]> => {
  return axios.get(`${baseUrl}/games/${gameId}/history`, getRequestHeaders())
    .then((response) => {
      return response.data as IGameMove[]
    })
}

export const getGameSetup = (gameId: string): Promise<IGameSetup> => {
  return axios.get(`${baseUrl}/games/${gameId}/setup`, getRequestHeaders())
    .then((response) => {
      return response.data
    })
}