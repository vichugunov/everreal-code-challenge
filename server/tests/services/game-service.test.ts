/// <reference types="@types/jest" />
jest.mock('../../src/helpers/constants')
import { generateGame } from './../../src/services/game-service'
import { getConstants } from '../../src/helpers/constants'
import { IConstants } from './../../src/interfaces'

const mockedGetConstants = getConstants as jest.MockedFunction<typeof getConstants>

describe('game service', () => {
  test('should generate game of correct size and colors', () => {
    const customConstants: IConstants = {
      boardSize: 2,
      colors: ['#fff', 'red']
    }

    mockedGetConstants.mockReturnValue(customConstants)
    const game = generateGame()
    expect(game.board.length).toBe(customConstants.boardSize)
    game.board.forEach(boardRow => {
      expect(boardRow.length).toBe(customConstants.boardSize)
      boardRow.forEach(cellColor => {
        expect(customConstants.colors).toContain(cellColor)
      })
    })
  })
})