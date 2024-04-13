import { afterEach, expect, jest, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

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
  code: any
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
  const options = {
    searchPath: '/test',
  }
  expect(await SearchFile.searchFile(options)).toBe(
    `fileA
fileB
nested/fileC`,
  )
})

test('searchFile - error - ripgrep could not be found', async () => {
  // @ts-ignore
  RipGrep.exec.mockImplementation(() => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  const options = {
    searchPath: '/test',
  }
  expect(await SearchFile.searchFile(options)).toBe(``)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith('[shared-process] ripgrep could not be found at "/test/rg"')
})

test('searchFile - error', async () => {
  // @ts-ignore
  RipGrep.exec.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const options = {
    searchPath: '/test',
  }
  expect(await SearchFile.searchFile(options)).toBe(``)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(new TypeError(`x is not a function`))
})
