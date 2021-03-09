export interface IGameUserMove {
  color: string
}

export interface IGameMove extends IGameUserMove {
  result: GameBoard
  isGameComplete: boolean
}

export type GameBoard = Array<Array<string>>
export type GameMoves = Array<IGameMove>
export type Vertex = [ number, number ]

export interface IGame {
  name?: string
  board: GameBoard
  moves: GameMoves
}

export interface IGameCollection {
  [gameId: string]: IGame
}

export interface IUserGame extends IGame {
  gameId: string
}