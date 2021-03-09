import * as Express from 'express'
import { createToken } from '../services/user-service'

const router = Express.Router()

router.post('/login', (req, res) => {
  const { password, username } = req.body
  if (username == process.env.username && password === process.env.password) {
    const jwtToken = createToken()

    res.send(jwtToken)
    return
  }

  res.sendStatus(401)
})

export default router
