import * as Express from 'express'
import { IGameResponse, IGame, IGameStat, IGameMove, GameBoard } from '../interfaces'
import { authMiddleware } from '../services/user-service'
import { generateUserGame, recordUserMove, getGame, solveGame, getGameIds, getConnectedVertices } from './../services/game-service'

const router = Express.Router()

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

router.get('/:gameId/setup', authMiddleware(), (req, res) => {
  const gameId = req.params.gameId

  try {
    const game = getGame(gameId)
    res.send({ board: game.board, connectedVertices: getConnectedVertices(game.board) })
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

router.get('/:gameId/ai-solution-steps', authMiddleware(), async (req, res) => {
  const gameId = req.params.gameId

  try {
    const aiSteps = await solveGame(gameId)
    res.send(aiSteps)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.get('/:gameId', authMiddleware(), async (req, res) => {
  const gameId = req.params.gameId

  try {
    const game = getGame(gameId)
    res.send(game)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

router.get('/', authMiddleware(), (req, res) => {
  const gameIds = getGameIds()
  const games = gameIds.map(getGame)

  const gameStats: Array<IGameStat> = games.map((game, idx) => {
    const lastMove: IGameMove | null = game.moves.length ? game.moves[game.moves.length - 1] : null

    return {
      name: game.name,
      gameId: gameIds[idx],
      currentBoard: lastMove == null ? game.board : lastMove.result,
      connectedVertices: lastMove == null ? getConnectedVertices(game.board) : lastMove.connectedAfterApply,
      lastChangeAtMs: lastMove == null ? game.createdAtMs as number : lastMove.createdAtMs
    }
  })

  res.send(gameStats)
})

router.post('/', authMiddleware(), (req, res) => {
  const { name } = req.body
  const game = generateUserGame(name)
  res.send(game)
})

export default router
