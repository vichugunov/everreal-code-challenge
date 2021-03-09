export interface IGameUserMove {
  color: string
}

export interface IGameMove extends IGameUserMove {
  result: GameBoard
}

export type GameBoard = Array<Array<string>>
export type GameMoves = Array<IGameMove>

export interface IGame {
  board: GameBoard
  moves: GameMoves
}

export interface IGameCollection {
  [gameId: string]: IGame
}

export interface IUserGame extends IGame {
  gameId: string
}