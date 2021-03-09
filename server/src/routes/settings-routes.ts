import * as Express from 'express'
import { authMiddleware } from '../services/user-service'
import constants from './../helpers/constants'

const router = Express.Router()

router.get('/', authMiddleware(), (req, res) => {
  res.send({
    boardSize: constants.boardSize,
    colors: constants.colors
  })
})

export default router
