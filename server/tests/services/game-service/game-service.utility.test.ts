/// <reference types="@types/jest" />
jest.mock('../../../src/helpers/constants')
import * as gameService from '../../../src/services/game-service'
import { getConstants } from '../../../src/helpers/constants'
import { GameBoard, IConstants, Vertex, IGame } from '../../../src/interfaces'

const mockedGetConstants = getConstants as jest.MockedFunction<typeof getConstants>

describe('game service: utilities', () => {
  const { isIndexInRange, getVertexColor, cloneBoard, setGame, getGame } = gameService
  const oldProcessEnv = process.env

  const rootVertexColor: string = 'red'
  const board: GameBoard = [[rootVertexColor]]
  const vertex: Vertex = [0, 0]

  const customConstants: IConstants = {
    boardSize: 2,
    colors: ['#fff', 'red']
  }

  beforeEach(() => {
    process.env = oldProcessEnv
  })

  beforeAll(() => {
    mockedGetConstants.mockReturnValue(customConstants)
  })

  // isIndexInRange
  test('should confirm, that 1st index is out of the range', () => {
    expect(isIndexInRange([3, 0])).toBe(false)
    expect(isIndexInRange([-3, 0])).toBe(false)
  })

  test('should confirm, that 2st index is out of the range', () => {
    expect(isIndexInRange([0, 3])).toBe(false)
    expect(isIndexInRange([0, -3])).toBe(false)
  })

  // get vertex color
  test('should throw if indices are out of the range', () => {
    // pre-condition
    jest.spyOn(gameService, 'isIndexInRange')
      .mockReturnValueOnce(false)

    expect(() => getVertexColor(board, vertex)).toThrow()
  })

  test('should return color if indices are in the range', () => {
    // pre-condition
    jest.spyOn(gameService, 'isIndexInRange')
      .mockReturnValueOnce(true)

    expect(getVertexColor(board, vertex)).toBe(rootVertexColor)
  })

  //----

  // cloneBoard
  test('should deep clone board', () => {
    const clonedBoard = cloneBoard(board)
    const newColor = '#fff'
    clonedBoard[0][0] = newColor

    expect(clonedBoard[0][0]).toBe(newColor)
    expect(board[0][0]).toBe(rootVertexColor)
    expect(newColor).not.toBe(rootVertexColor)
  })

  // set game
  test('should set game for testing purposes', () => {
    const game: IGame = {
      board: [],
      moves: []
    }

    const id = 'test'

    setGame(id, game)
    expect(() => getGame(id)).not.toThrow()
  })

  test('should not set game if NODE_ENV is not test', () => {
    process.env.NODE_ENV = 'prod'
    const game: IGame = {
      board: [],
      moves: []
    }

    const id = 'test'

    expect(() => setGame(id, game)).toThrow()
  })
  // -----
})