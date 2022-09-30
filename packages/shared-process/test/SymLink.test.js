import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs/promises', () => {
  return {
    symlink: jest.fn(() => {
      throw new Error('not implemented')
    }),
    mkdir: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const fs = await import('node:fs/promises')
const SymLink = await import('../src/parts/SymLink/SymLink.js')

class NodeError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

test('createSymLink - error', async () => {
  // @ts-ignore
  fs.symlink.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  fs.mkdir.mockImplementation(async () => {})
  await expect(
    SymLink.createSymLink('/test/from', '/test/to')
  ).rejects.toThrowError(
    new Error(
      'Failed to create symbolic link from /test/from to /test/to: x is not a function'
    )
  )
})

test('createSymLink - error - EEXIST', async () => {
  // @ts-ignore
  fs.symlink.mockImplementation(async () => {
    throw new NodeError('EEXIST')
  })
  // @ts-ignore
  fs.mkdir.mockImplementation(() => {})
  await expect(
    SymLink.createSymLink('/test/from', '/test/to')
  ).rejects.toHaveProperty('code', 'EEXIST')
})

test('createSymLink', async () => {
  // @ts-ignore
  fs.symlink.mockImplementation(() => {})
  // @ts-ignore
  fs.mkdir.mockImplementation(() => {})
  await SymLink.createSymLink('/test/from', '/test/to')
  expect(fs.symlink).toHaveBeenCalledTimes(1)
  expect(fs.symlink).toHaveBeenCalledWith('/test/from', '/test/to')
})
