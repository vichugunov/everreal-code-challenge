export type Vertex = [ number, number ]
export type GameBoard = Array<Array<string>>

export interface IGameUserMove {
  color: string
}

export interface IGameMove extends IGameUserMove {
  result: GameBoard
  isGameComplete: boolean
  // to draw a nice line border on the frontend
  connectedBeforeApply: Array<Vertex>
}

export type GameMoves = Array<IGameMove>

export interface IGame {
  name?: string
  board: GameBoard
  moves: GameMoves
}

// to draw a nice line border on the frontend
export interface IGameResponse extends IGame {
  gameId: string
  connectedVertices: Array<Vertex>
}

export interface IGameCollection {
  [gameId: string]: IGame
}

export interface IUserGame extends IGame {
  gameId: string
}