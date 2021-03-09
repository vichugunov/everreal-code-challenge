import { v4 as uuidv4 } from 'uuid'
import { GameBoard, IUserGame, IGameMove, IGameCollection } from './../interfaces'
import { getConstants } from './../helpers/constants'

const games: IGameCollection = {}

/**
 * Generate a new game
 * @returns A new generated game
 */
export const generateGame = (): IUserGame => {
  const gameId = uuidv4()
  const { boardSize, colors } = getConstants()

  const board: GameBoard = new Array<Array<string>>()
  for (let i = 0; i < boardSize; i += 1 ) {
    board[i] = new Array<string>()
    for (let j = 0; j < boardSize; j += 1) {
      board[i][j] = colors[Math.floor(Math.random() * colors.length)]
    }
  }

  const game = {
    gameId,
    board,
    moves: []
  }

  games[gameId] = game

  return game
}

export const getGame = (gameId: string) => {
  if (!games[gameId]) {
    throw new Error(`Game with ${gameId} not found`)
  }

  return games[gameId]
}

export const deleteGame = (gameId: string) => {
  if (!games[gameId]) {
    throw new Error(`Game with ${gameId} not found`)
  }

  delete games[gameId]
}

export const deleteAllGames = () => {
  Object.keys(games)
        .map(deleteGame)
}