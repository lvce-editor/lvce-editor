import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('symlink-dir', () => {
  return {
    default: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SymLink = await import('../src/parts/SymLink/SymLink.js')
const symlinkDir = (await import('symlink-dir')).default

class NodeError extends Error {
  code: any
  constructor(code) {
    super(code)
    this.code = code
  }
}

test('createSymLink - error', async () => {
  // @ts-ignore
  symlinkDir.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(SymLink.createSymLink('/test/from', '/test/to')).rejects.toThrow(new TypeError('x is not a function'))
})

test('createSymLink - error - EEXIST', async () => {
  // @ts-ignore
  symlinkDir.mockImplementation(async () => {
    throw new NodeError(ErrorCodes.EEXIST)
  })
  await expect(SymLink.createSymLink('/test/from', '/test/to')).rejects.toHaveProperty('code', ErrorCodes.EEXIST)
})

test('createSymLink', async () => {
  // @ts-ignore
  symlinkDir.mockImplementation(() => {})
  await SymLink.createSymLink('/test/from', '/test/to')
  expect(symlinkDir).toHaveBeenCalledTimes(1)
  expect(symlinkDir).toHaveBeenCalledWith('/test/from', '/test/to')
})
