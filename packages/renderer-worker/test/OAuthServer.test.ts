import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const OAuthServer = await import('../src/parts/OAuthServer/OAuthServer.js')

const successHtml = '<html><body>success</body></html>'
const errorHtml = '<html><body>error</body></html>'

test('create', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => 3000)
  const result = await OAuthServer.create('window-1', successHtml, errorHtml)
  expect(result).toBe(3000)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('OAuthServer.create', 'window-1', successHtml, errorHtml)
})

test('getCode', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => 'auth-code')
  const result = await OAuthServer.getCode('window-1')
  expect(result).toBe('auth-code')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('OAuthServer.getCode', 'window-1')
})

test('dispose', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async () => {})
  await OAuthServer.dispose('window-1')
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('OAuthServer.dispose', 'window-1')
})
