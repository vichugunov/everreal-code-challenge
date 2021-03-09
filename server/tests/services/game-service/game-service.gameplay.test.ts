/// <reference types="@types/jest" />
jest.mock('../../../src/helpers/constants')
import {
  isGameComplete,
  getConnectedVertices,
  makeMove,
  setGame,
  cloneBoard,
  fillConnectedVertices,
  recordUserMove,
  getGame,
  solveGame
} from '../../../src/services/game-service'

import { getConstants } from '../../../src/helpers/constants'
import { GameBoard, IConstants, IGame, Vertex } from '../../../src/interfaces'

const mockedGetConstants = getConstants as jest.MockedFunction<typeof getConstants>
import { expectFlatArraysEqual, expectArrayOfArraysEqual } from './../../utils/array-compare'

const emptyBoard: GameBoard = []
const allZerosBoard: GameBoard = [
  ['0', '0', '0', '0'],
  ['0', '0', '0', '0'],
  ['0', '0', '0', '0'],
  ['0', '0', '0', '0']
]

describe('game service: gameplay', () => {
  const gameId = 'test'

  const customConstants: IConstants = {
    boardSize: 4,
    colors: ['0', '1']
  }

  beforeAll(() => {
    mockedGetConstants.mockReturnValue(customConstants)
  })

  // isGameComplete
  test('should confirm, that game is complete', () => {
    expect(isGameComplete(allZerosBoard)).toBe(true)
  })

  test('should confirm, that game is not complete', () => {
    const board: GameBoard = cloneBoard(allZerosBoard)
    board[0][1] = '1'
    expect(isGameComplete(board)).toBe(false)
  })

  //-----

  // getConnectedVertices
  test('should return an array of single item if root color is different', () => {
    const board = cloneBoard(allZerosBoard)
    board[0][0] = '1'

    expect(getConnectedVertices(board)).toHaveLength(1)
  })

  test('should return correct connected vertices the same color', () => {
    const board = [
      ['0', '0', '1', '1'],
      ['0', '0', '0', '1'],
      ['0', '1', '1', '1'],
      ['1', '0', '0', '0']
    ]

    const expected: Array<Vertex> = [
      [0, 0], [0, 1],
      [1, 0], [1, 1], [1, 2],
      [2, 0]
    ]

    const result = getConnectedVertices(board)

    // expect that boards are equal
    expectFlatArraysEqual(result, expected)
  })

  test('should return correct connected vertices - triangle on the top', () => {
    const board = cloneBoard(allZerosBoard)
    board[0][0] = '1'
    board[0][1] = '1'
    board[1][0] = '1'

    const expected: Array<Vertex> = [
      [0, 0], [0, 1],
      [1, 0]
    ]

    const result = getConnectedVertices(board)

    // expect that boards are equal
    expectFlatArraysEqual(result, expected)
  })
  //-----

  // makeMove
  test('should make a move and mark step as complete if only root left', () => {
    const board = cloneBoard(allZerosBoard)
    board[0][0] = '1'

    const expectedMove = {
      result: allZerosBoard,
      color: '0',
      isGameComplete: true
    }

    const move = makeMove(board, '0')

    // expect that boards are equal
    expectFlatArraysEqual(move.result, expectedMove.result)
    expect(move.color).toEqual(expectedMove.color)
    expect(move.isGameComplete).toEqual(expectedMove.isGameComplete)
  })

  test('should make a move and mark step as complete if chain present', () => {
    const board = cloneBoard(allZerosBoard)
    board[0][0] = '1'
    board[0][1] = '1'
    board[1][0] = '1'

    const expectedMove = {
      result: allZerosBoard,
      color: '0',
      isGameComplete: true
    }

    const move = makeMove(board, '0')

    // expect that boards are equal
    expectFlatArraysEqual(move.result, expectedMove.result)
    expect(move.color).toEqual(expectedMove.color)
    expect(move.isGameComplete).toEqual(expectedMove.isGameComplete)
  })
  //----

  // fillConnectedVertices
  test('should fill triangle on the top', () => {
    const board = cloneBoard(allZerosBoard)
    board[0][0] = '1'
    board[0][1] = '1'
    board[1][0] = '1'

    expectArrayOfArraysEqual(fillConnectedVertices(board, '0'), allZerosBoard)
  })

  test('should fill a single item', () => {
    const board = cloneBoard(allZerosBoard)
    board[0][0] = '1'

    expectArrayOfArraysEqual(fillConnectedVertices(board, '0'), allZerosBoard)
  })

  // ----

  // recordUserMove
  test('should record a user action', () => {
    const board = cloneBoard(allZerosBoard)
    board[0][0] = '1'
    board[0][1] = '1'
    board[1][0] = '1'

    const game: IGame = {
      board: board,
      moves: []
    }

    setGame(gameId, game)
    recordUserMove(gameId, '0')
    const recordedGame = getGame(gameId)
    expect(recordedGame.moves).toHaveLength(1)
  })

  test('should throw if color is out of the range', () => {
    expect(() => recordUserMove('', '3')).toThrow()
  })

  test('should throw if game is already complete', () => {
    const game: IGame = {
      board: allZerosBoard,
      moves: [
        {
          result: allZerosBoard,
          color: '0',
          isGameComplete: true,
          connectedBeforeApply: getConnectedVertices(allZerosBoard)
        }
      ]
    }

    setGame(gameId, game)
    expect(() => recordUserMove(gameId, '1')).toThrow()
  })
  // ----
  // solveGame
  test('should solve a game', async () => {
    const board = [
      ['0', '0', '1', '1'],
      ['0', '0', '0', '1'],
      ['0', '1', '1', '1'],
      ['1', '0', '0', '0']
    ]

    const game: IGame = {
      board: board,
      moves: []
    }

    setGame(gameId, game)
    const solutionResult = await solveGame(gameId)
    const moves = solutionResult.moves
    const lastMove = moves[moves.length - 1]
    expect(lastMove.isGameComplete).toBe(true)

    const expectedBoard = fillConnectedVertices(allZerosBoard, lastMove.color)
    expectArrayOfArraysEqual(lastMove.result, expectedBoard)
  })
})