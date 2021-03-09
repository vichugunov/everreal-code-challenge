import { v4 as uuidv4 } from 'uuid'
import { GameBoard, IUserGame, IGameMove, IGameCollection } from './../interfaces'
import { getConstants } from './../helpers/constants'

const games: IGameCollection = {}

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