/// <reference types="@types/jest" />
jest.mock('../../src/helpers/constants')
import { generateGame, getGame, deleteGame, deleteAllGames } from './../../src/services/game-service'
import { getConstants } from '../../src/helpers/constants'
import { IConstants } from './../../src/interfaces'

const mockedGetConstants = getConstants as jest.MockedFunction<typeof getConstants>

describe('game service', () => {
  const customConstants: IConstants = {
    boardSize: 2,
    colors: ['#fff', 'red']
  }

  beforeEach(() => {
    mockedGetConstants.mockReturnValue(customConstants)
  })

  afterEach(() => {
    deleteAllGames()
  })

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

  test('should throw if game not found', () => {
    expect(() => getGame('1234')).toThrow()
  })

  test('should persist game after generation', () => {
    const game = generateGame()
    const persistedGame = getGame(game.gameId)
    // expect that boards are equal
    for (let i = 0; i < game.board.length; i += 1 ) {
      expect(game.board[i]).toEqual(expect.arrayContaining(persistedGame.board[i]))
      expect(persistedGame.board[i]).toEqual(expect.arrayContaining(game.board[i]))
    }

    // expect that moves are equal
    expect(game.moves).toEqual(expect.arrayContaining(persistedGame.moves))
    expect(persistedGame.moves).toEqual(expect.arrayContaining(game.moves))
  })
})