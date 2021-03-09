import { v4 as uuidv4 } from 'uuid'
import { GameBoard, IUserGame, IGameMove, IGameCollection, Vertex, IGame, IGameResponse } from './../interfaces'
import { getConstants } from './../helpers/constants'
import ms from 'ms'

const games: IGameCollection = {}

/**
 * Generate a new game
 * @returns A new generated game
 */
export const generateGame = (name?: string): IUserGame => {
  const gameId = uuidv4()
  const { boardSize, colors } = getConstants()

  const board: GameBoard = new Array<Array<string>>()
  for (let i = 0; i < boardSize; i += 1 ) {
    board[i] = new Array<string>(boardSize)
    for (let j = 0; j < boardSize; j += 1) {
      board[i][j] = colors[Math.floor(Math.random() * colors.length)]
    }
  }

  const game = {
    board,
    moves: [],
    createdAtMs: Date.now()
  }

  games[gameId] = game

  return {
    ...game,
    gameId
  }
}

/**
 * Return frontend-friendly game response
 * @param name target user game name. optional
 * @returns game response with connected vertices for the frontend
 */
export const generateUserGame = (name?: string): IGameResponse => {
  const game = generateGame(name)
  return {
    ...game,
    connectedVertices: getConnectedVertices(game.board)
  }
}

/**
 * Return a game by its id
 * @param gameId game identifier
 * @returns Game
 */
export const getGame = (gameId: string): IGame => {
  if (!games[gameId]) {
    throw new Error(`Game with ${gameId} not found`)
  }

  return games[gameId]
}

/**
 * Return all game identifiers
 */

export const getGameIds = (): string[] => {
  return Object.keys(games)
}

/**
 * Persist game with provided identifier.
 * NB: To be used only for testing purposes
 * @param gameId game identifier
 * @param game game to save
 */
export const setGame = (gameId: string, game: IGame): void => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('available only for testing purposes')
  }

  games[gameId] = game
}

/**
 * Delete specific game
 * @param gameId game identifier
 */
export const deleteGame = (gameId: string) => {
  if (!games[gameId]) {
    throw new Error(`Game with ${gameId} not found`)
  }

  delete games[gameId]
}

/**
 * Delete everything, that persists in game collection
 */
export const deleteAllGames = () => {
  Object.keys(games)
        .map(deleteGame)
}

/**
 * Check whether coordinate is in range
 * @param param0 ith coordinate (row)
 * @param param1 jth coordinate (column)
 * @returns
 */
export const isIndexInRange = ([i,j]: Vertex ) => {
  const { boardSize } = getConstants()

  const firstIndexInRange  = i >= 0 && i <= boardSize - 1
  const secondIndexInRange = j >= 0 && j <= boardSize - 1

  return firstIndexInRange && secondIndexInRange
}

/**
 * Get a color of a vertex
 * @param node [i,j]: [number, number]
 */
export const getVertexColor = (board: GameBoard, [i,j]: Vertex): string => {
  if (!isIndexInRange([i,j])) {
    throw new Error(`Out of a range: [${i}, ${j}] in a board ${board}`)
  }

  return board[i][j]
}

/**
 * Check whether game is complete
 * @param board Board to inspect
 * @returns boolean The flag that the game is complete
 */
export const isGameComplete = (board: GameBoard): boolean => {
  const rootVertexColor = getVertexColor(board, [0, 0])
  return board.every(boardRow => {
    return boardRow.every(cellColor => {
      return cellColor === rootVertexColor
    })
  })
}

/**
 * Return an array of vertices, that are tuples [i,j], which have provided color path from
 * the root vertex [0, 0]
 * @param color color of desired connected vertices
 */
export const getConnectedVertices = (board: GameBoard): Array<Vertex> => {
  const { boardSize } = getConstants()

  const rootVertex: Vertex = [0, 0]
  const connectedVertices = new Array<Vertex>()

  const rootVertexColor = getVertexColor(board, rootVertex)

  const visited: Array<Array<boolean>> = new Array<Array<boolean>>()
  // fill all as not visited
  for (let i = 0; i < boardSize; i += 1) {
    visited[i] = new Array<boolean>(boardSize)
    for (let j = 0; j < boardSize; j += 1) {
      visited[i][j] = false
    }
  }

  // mark root vertex as visited
  const markVertexAsVisited = ([i, j]: Vertex) => {
    visited[i][j] = true
  }

  const isVertexVisited = ([i, j]: Vertex): boolean => {
    return visited[i][j]
  }

  // queue of suspicious to be connected vertices
  const vertexQueue: Array<Vertex> = new Array<Vertex>()
  vertexQueue.push(rootVertex)

  while (vertexQueue.length > 0) {
    const vertex = vertexQueue.pop()
    if (!vertex) {
      break
    }

    const [i, j] = vertex

    markVertexAsVisited(vertex)

    // check current vertex
    // if color does not match - no sense to check its vertices
    if (getVertexColor(board, vertex) !== rootVertexColor) {
      continue
    }

    // color matches -> save it to our connected list of vertices
    connectedVertices.push(vertex)

    const neighboursToCheck: Array<Vertex> = [
      [i - 1, j],
      [i + 1, j],
      [i, j - 1 ],
      [i, j + 1 ]
    ]

    // add to the queue all neighbours, that are not yet visited
    neighboursToCheck.forEach(neighbourVertex => {
      if (isIndexInRange(neighbourVertex) && !isVertexVisited(neighbourVertex)) {
        vertexQueue.push(neighbourVertex)
      }
    })
  }

  return connectedVertices
}

/**
 * Deep clone board to support immutability
 * @param board board to clone
 * @returns GameBoard Cloned board
 */
export const cloneBoard = (board: GameBoard): GameBoard => {
  return board.map(boardRow => {
    return boardRow.slice()
  })
}

/**
 * Applies the color to the game board
 * @param board game board
 * @param color color to fill
 * @returns game board after apply color
 */
export const fillConnectedVertices = (board: GameBoard, color: string): GameBoard => {
  const connectedVertices = getConnectedVertices(board)

  // copy an array
  const result: GameBoard = cloneBoard(board)
  // no vertices match provided color -> add root vertex to fill it
  if (connectedVertices.length === 0) {
    connectedVertices.push([0, 0])
  }

  // fill connected vertices with provided color and return this new board
  connectedVertices.forEach(vertex => {
    const [i, j] = vertex
    result[i][j] = color
  })

  return result
}

/**
 * Perform a move and return the outcome of this action
 * NB: The result is not stored in game collection
 * @param gameId id of the game
 * @param color an artifact of a user move
 */

export const makeMove = (board: GameBoard, color: string): IGameMove => {
  const { colors } = getConstants()
  if (!colors.includes(color)) {
    throw new Error(`[move] Provided color ${color} is not present in acceptable user colors: ${JSON.stringify(colors)}`)
  }
  const connectedBeforeApply = getConnectedVertices(board)

  // no vertices match provided color -> add root vertex to fill it
  if (connectedBeforeApply.length === 0) {
    connectedBeforeApply.push([0, 0])
  }

  const result = fillConnectedVertices(board, color)

  return {
    color,
    result,
    isGameComplete: isGameComplete(result),
    connectedBeforeApply,
    connectedAfterApply: getConnectedVertices(result),
    createdAtMs: Date.now()
  }
}

/**
 * Perform a move, initiated by a user and write it to game collection
 * @param gameId id of the game
 * @param color an artifact of a user move
 */
export const recordUserMove = (gameId: string, color: string): IGameMove => {
  const game = getGame(gameId)
  const moves = game.moves
  const lastMove: IGameMove | null = moves.length > 0 ? moves[moves.length - 1] : null
  const isGameAlreadyComplete = lastMove !== null && lastMove.isGameComplete

  if (isGameAlreadyComplete) {
    throw new Error(`Game ${gameId} already complete. Please start a new one`)
  }

  const board = lastMove !== null ? lastMove.result : game.board
  const move = makeMove(board, color)

  game.moves.push(move)
  return move
}

/**
 * Greedy algorithm to solve a game - always fill colors with maximum interconnected vertices
 * @param gameId Game id
 */
export const solveGame = (gameId: string): Promise<{executionTimeHuman: string, moves: Array<IGameMove>}> => {
  return new Promise((resolve) => {
    const startTime = Date.now()

    const { colors } = getConstants()
    const game = getGame(gameId)
    const moves = new Array<IGameMove>()

    // maybe we're lucky and new game is already solved
    if (isGameComplete(game.board)) {
      resolve({
        executionTimeHuman: ms(Date.now() - startTime, { long: true }),
        moves
      })
    }

    do {
      const board = moves.length == 0 ? game.board : moves[moves.length - 1].result
      const connectedVerticesAfterApplyColor: Array<[string, number]> = colors.map(color => {
        return [ color, getConnectedVertices(fillConnectedVertices(board, color)).length]
      })

      // sort descending by length of connected colors
      connectedVerticesAfterApplyColor.sort(([colorA, appliedVerticiesLengthA], [colorB, appliedVerticiesLengthB]) => {
        return appliedVerticiesLengthB - appliedVerticiesLengthA
      })

      const colorToUse = connectedVerticesAfterApplyColor[0][0]
      const move = makeMove(board, colorToUse)

      moves.push(move)
    } while (moves.length > 0 && !moves[moves.length - 1].isGameComplete)

    resolve({
      executionTimeHuman: ms(Date.now() - startTime, { long: true }),
      moves
    })
  })
}