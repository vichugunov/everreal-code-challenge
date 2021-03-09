import * as Express from 'express'
import { authMiddleware } from '../services/user-service'
import { generateGame } from './../services/game-service'

const router = Express.Router()

router.get('/new', authMiddleware(), (req, res) => {
  res.send(generateGame())
})

export default router
