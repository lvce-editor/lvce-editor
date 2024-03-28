import { jest } from '@jest/globals'
import { beforeEach, test, expect } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
  globalThis.alert = jest.fn()
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getText: jest.fn(),
  }
})

const UnhandledErrorHandling = await import('../src/parts/UnhandledErrorHandling/UnhandledErrorHandling.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const Ajax = await import('../src/parts/Ajax/Ajax.js')

test('handleError - normal error', async () => {
  const message = 'oops'
  const filename = '/test/file.js'
  const lineno = 1
  const colno = 1
  const mockError = new Error('oops')
  let _resolve
  const promise = new Promise((r) => {
    _resolve = r
  })
  // @ts-ignore
  Ajax.getText.mockImplementation(() => {
    setTimeout(() => {
      _resolve(undefined)
    }, 0)
    return ''
  })
  UnhandledErrorHandling.handleUnhandledError(message, filename, lineno, colno, mockError)
  await promise
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(expect.stringContaining(`[renderer-process] Unhandled Error: Error: oops`))
})

test('handleError - null', async () => {
  const message = ''
  const filename = ''
  const lineno = 1
  const colno = 1
  const mockError = null
  const promise = new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
  UnhandledErrorHandling.handleUnhandledError(message, filename, lineno, colno, mockError)
  await promise
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(`[renderer-process] Unhandled Error: null`)
})
