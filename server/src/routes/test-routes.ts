import * as Express from 'express'
import { authMiddleware } from '../services/user-service'

const router = Express.Router()

router.get('/hello', authMiddleware(), (req, res) => {
  res.send('world')
})

export default router
