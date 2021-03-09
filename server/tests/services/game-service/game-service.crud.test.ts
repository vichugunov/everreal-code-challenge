/// <reference types="@types/jest" />
jest.mock('../../../src/helpers/constants')
import { generateGame, getGame, deleteGame, deleteAllGames } from '../../../src/services/game-service'
import { getConstants } from '../../../src/helpers/constants'
import { IConstants, IGame } from '../../../src/interfaces'
import { expectFlatArraysEqual, expectArrayOfArraysEqual } from './../../utils/array-compare'

const mockedGetConstants = getConstants as jest.MockedFunction<typeof getConstants>

describe('game service: CRUD game', () => {
  const customConstants: IConstants = {
    boardSize: 2,
    colors: ['#fff', 'red']
  }

  beforeAll(() => {
    mockedGetConstants.mockReturnValue(customConstants)
  })

  afterEach(() => {
    deleteAllGames()
  })

  // create
  test('should generate game of correct size and colors', () => {
    const game = generateGame()
    expect(game.board.length).toBe(customConstants.boardSize)
    game.board.forEach(boardRow => {
      expect(boardRow.length).toBe(customConstants.boardSize)
      boardRow.forEach(cellColor => {
        expect(customConstants.colors).toContain(cellColor)
      })
    })
  })
  // -----

  // read
  test('should throw on asking a game if game not found', () => {
    expect(() => getGame('1234')).toThrow()
  })

  test('should persist game after generation', () => {
    const game = generateGame()
    const persistedGame = getGame(game.gameId)
    // expect that boards are equal
    expectArrayOfArraysEqual(game.board, persistedGame.board)

    // expect that moves are equal
    expectFlatArraysEqual(game.moves, persistedGame.moves)
  })
  // -----

  // delete
  test('should throw on game removal if game not found', () => {
    expect(() => deleteGame('1234')).toThrow()
  })

  test('should delete an existing game', () => {
    const game = generateGame()
    expect(() => deleteGame(game.gameId)).not.toThrow()
    expect(() => getGame(game.gameId)).toThrow()
  })
  // -----
})