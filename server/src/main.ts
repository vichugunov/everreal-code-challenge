require('dotenv-safe').config()
import express, { Router } from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'

import { initializePassport } from './services/user-service'
import swaggerUi from 'swagger-ui-express'
import paths from './helpers/paths'
import path from 'path'
import YAML from 'yamljs'

import userRouter from './routes/user-routes'
import settingsRouter from './routes/settings-routes'

const swaggerDocument = YAML.load(path.resolve(paths.assetPath, 'swagger.yaml'))

import cors from 'cors'

const app = express()

const port = process.env.port || 8080

app.use(cors({
  origin: [
    'http://localhost:8000',
    'http://localhost:8080'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

app.use(bodyParser.json())
app.use(passport.initialize())

initializePassport()

const swaggerOptions = {
  swaggerOptions: {
    validatorUrl: null
  }
}

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))

// ---------------------
app.use(userRouter)
app.use('/settings', settingsRouter)

app.listen(port, () => {
  console.log('server is listening to the port', port)
})
