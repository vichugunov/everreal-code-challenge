import passport from 'passport'
import { Strategy as JwtBearerStrategy, ExtractJwt } from 'passport-jwt'
import { IServerUserInfo } from './../interfaces'

import * as Jwt from 'jsonwebtoken'

const getJwtSecret = () => {
  const jwtSecret = process.env.jwt_secret

  if (!jwtSecret) {
    console.error('no jwt_secret defined in process.env')
    process.exit(1)
  }

  return jwtSecret
}

export const initializePassport = () => {
  const jwtBearerOptions = {
    // issue: https://github.com/bradtraversy/meanauthapp/issues/9
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getJwtSecret(),
    algorithms: ['HS256'],
    passReqToCallback: false
  }

  passport.use('jwt', new JwtBearerStrategy(jwtBearerOptions,
    (jwtPayload, done) => {
      if (jwtPayload.exp * 1000 < (new Date().getTime())) {
        throw new Error('Token has expired')
      }

      if (jwtPayload.uid !== process.env.test_uid) {
        return done('user not found', false)
      }

      done(null, {})
    }
  ))
}

export const getUserInfo = (): IServerUserInfo => {
  if (!process.env.test_uid) {
    throw new Error('test_id in env not defined')
  }

  const userSettings: IServerUserInfo = {
    uid: process.env.test_uid
  }

  return userSettings
}

export const createToken = () => {
  return Jwt.sign(getUserInfo(), getJwtSecret(), { expiresIn: process.env.expiresIn })
}

export const authMiddleware = () => {
  return passport.authenticate('jwt', { session: false })
}
