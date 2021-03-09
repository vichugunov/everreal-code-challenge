import * as Express from 'express'
import { authMiddleware } from '../services/user-service'
import { getConstants } from './../helpers/constants'

const router = Express.Router()

router.get('/', authMiddleware(), (req, res) => {
  const constants = getConstants()

  res.send({
    boardSize: constants.boardSize,
    colors: constants.colors
  })
})

export default router
