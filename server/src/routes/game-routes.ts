import * as Express from 'express'
import { IGameResponse, IGame } from '../interfaces'
import { authMiddleware } from '../services/user-service'
import { generateUserGame, recordUserMove, getGame, solveGame } from './../services/game-service'

const router = Express.Router()


router.get('/new', authMiddleware(), (req, res) => {
  const game = generateUserGame()
  res.send(game)
})

router.post('/:gameId/move', authMiddleware(), (req, res) => {
  const gameId = req.params.gameId
  const { color } = req.body

  try {
    const move = recordUserMove(gameId, color)
    res.send(move)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.get('/:gameId/history', authMiddleware(), (req, res) => {
  const gameId = req.params.gameId

  try {
    const game = getGame(gameId)
    const userMoves = game.moves
    res.send(userMoves)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.get('/:gameId/ai-solution-steps', authMiddleware(), (req, res) => {
  const gameId = req.params.gameId

  try {
    const aiSteps = solveGame(gameId)
    res.send(aiSteps)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

export default router
