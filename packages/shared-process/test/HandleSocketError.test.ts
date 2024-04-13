import { expect, jest, test, afterEach } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  info: jest.fn(() => {}),
}))

const Logger = await import('../src/parts/Logger/Logger.js')
const HandleSocketError = await import('../src/parts/HandleSocketError/HandleSocketError.js')

afterEach(() => {
  jest.resetAllMocks()
})

class NodeError extends Error {
  code: any
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

test('handleSocketError - EPIPE', () => {
  const error = new NodeError('write EPIPE', ErrorCodes.EPIPE)
  HandleSocketError.handleSocketError(error)
  expect(Logger.info).not.toHaveBeenCalled()
})

test('handleSocketError - ECONNRESET', () => {
  const error = new NodeError('write ECONNRESET', ErrorCodes.ECONNRESET)
  HandleSocketError.handleSocketError(error)
  expect(Logger.info).not.toHaveBeenCalled()
})

test('handleSocketError - other error', () => {
  const error = new TypeError(`x is not a function`)
  HandleSocketError.handleSocketError(error)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith('[info shared process: handle error]', error)
})
