import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/AuthWorker/AuthWorker.js', () => {
  return {
    initialize: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => {
  return {
    get: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Product/Product.js', () => {
  return {
    getBackendUrl: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const AuthWorker = await import('../src/parts/AuthWorker/AuthWorker.js')
const Preferences = await import('../src/parts/Preferences/Preferences.js')
const Product = await import('../src/parts/Product/Product.js')
const StartupAuth = await import('../src/parts/StartupAuth/StartupAuth.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('initializeAuth uses configured backend url when available', async () => {
  const authState = {
    authAccessToken: 'token-1',
    authErrorMessage: '',
    userName: 'Test User',
    userState: 'loggedIn',
  }
  // @ts-ignore
  Preferences.get.mockReturnValue('https://configured.example')
  // @ts-ignore
  Product.getBackendUrl.mockReturnValue('https://default.example')
  // @ts-ignore
  AuthWorker.initialize.mockResolvedValue(authState)

  const result = await StartupAuth.initializeAuth(1, 'https://app.example/callback?code=code-1&state=state-1')

  expect(Preferences.get).toHaveBeenCalledTimes(1)
  expect(Preferences.get).toHaveBeenCalledWith('layout.backendUrl')
  expect(Product.getBackendUrl).toHaveBeenCalledTimes(0)
  expect(AuthWorker.initialize).toHaveBeenCalledTimes(1)
  expect(AuthWorker.initialize).toHaveBeenCalledWith('https://configured.example', 1, 'https://app.example/callback?code=code-1&state=state-1')
  expect(result).toEqual(authState)
})

test('initializeAuth falls back to product backend url', async () => {
  const authState = {
    authAccessToken: '',
    authErrorMessage: '',
    userName: '',
    userState: 'loggedOut',
  }
  // @ts-ignore
  Preferences.get.mockReturnValue('')
  // @ts-ignore
  Product.getBackendUrl.mockReturnValue('https://default.example')
  // @ts-ignore
  AuthWorker.initialize.mockResolvedValue(authState)

  const result = await StartupAuth.initializeAuth(2, 'https://app.example/')

  expect(Preferences.get).toHaveBeenCalledTimes(1)
  expect(Product.getBackendUrl).toHaveBeenCalledTimes(1)
  expect(AuthWorker.initialize).toHaveBeenCalledTimes(1)
  expect(AuthWorker.initialize).toHaveBeenCalledWith('https://default.example', 2, 'https://app.example/')
  expect(result).toEqual(authState)
})
