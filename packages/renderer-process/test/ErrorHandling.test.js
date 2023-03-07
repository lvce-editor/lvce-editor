import { jest } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
  globalThis.alert = jest.fn()
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    info: jest.fn(),
  }
})

const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')
const Logger = await import('../src/parts/Logger/Logger.js')

test('handleError - normal error', () => {
  const mockError = new Error('oops')
  ErrorHandling.handleError(mockError)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(`[renderer-process] Unhandled Error: Error: oops`)
})

test('handleError - null', () => {
  const mockError = null
  ErrorHandling.handleError(mockError)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(`[renderer-process] Unhandled Error: null`)
})

test('handleError - firefox worker error', () => {
  const mockError = `SyntaxError: import declarations may only appear at top level of a module`
  ErrorHandling.handleError(mockError)
  expect(Logger.info).not.toHaveBeenCalled()
})
