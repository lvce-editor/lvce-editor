import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

import { jest } from '@jest/globals'

afterEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RipGrep/RipGrep.js', () => {
  return {
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
    ripGrepPath: '/test/rg',
  }
})
jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    info: jest.fn(() => {}),
    error: jest.fn(() => {}),
  }
})

const SearchFile = await import('../src/parts/SearchFile/SearchFile.js')
const RipGrep = await import('../src/parts/RipGrep/RipGrep.js')
const Logger = await import('../src/parts/Logger/Logger.js')

class NodeError extends Error {
  constructor(code, message = code) {
    super(code + ':' + message)
    this.code = code
  }
}

test('searchFile', async () => {
  // @ts-ignore
  RipGrep.exec.mockImplementation(() => {
    return {
      stdout: `fileA
fileB
nested/fileC`,
    }
  })
  expect(await SearchFile.searchFile('/test', 'fileA', 10)).toBe(
    `fileA
fileB
nested/fileC`
  )
})

test('searchFile - error - ripgrep could not be found', async () => {
  // @ts-ignore
  RipGrep.exec.mockImplementation(() => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  expect(await SearchFile.searchFile('/test', 'fileA', 10)).toBe(``)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(
    '[shared-process] ripgrep could not be found at "/test/rg"'
  )
})

test('searchFile - error', async () => {
  // @ts-ignore
  RipGrep.exec.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  expect(await SearchFile.searchFile('/test', 'fileA', 10)).toBe(``)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(
    new TypeError(`x is not a function`)
  )
})
