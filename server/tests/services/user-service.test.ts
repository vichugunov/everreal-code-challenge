/// <reference types="@types/jest" />

import { getUserInfo } from './../../src/services/user-service'

describe('user service', () => {
  const oldProcessEnv = process.env
  const customEnv = {
    test_uid: '12345',
    jwt_secret: 'secret'
  }

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...oldProcessEnv, ...customEnv }
  })

  afterEach(() => {
    process.env = oldProcessEnv
  })

  test('should return right uid', () => {
    expect(getUserInfo().uid).toBe(customEnv.test_uid)
  })
})