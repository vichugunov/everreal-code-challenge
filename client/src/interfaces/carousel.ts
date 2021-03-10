export type Vertex = [ number, number ]
export type GameBoard = Array<Array<string>>

export interface IGameStat {
  name?: string
  gameId: string
  currentBoard: GameBoard
  connectedVertices: Array<Vertex>
  lastChangeAtMs: number
}