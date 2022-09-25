import { jest } from '@jest/globals'

afterEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs', () => ({
  createReadStream: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('node:fs/promises', () => ({
  mkdir: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('tar-fs', () => ({
  default: {
    extract: jest.fn(() => {
      throw new Error('not implemented')
    }),
  },
}))

jest.unstable_mockModule('node:zlib', () => ({
  createBrotliDecompress: jest.fn(() => {
    throw new Error('not implemented')
  }),
  createGunzip: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('node:stream/promises', () => ({
  pipeline: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const Extract = await import('../src/parts/Extract/Extract.js')
const fsPromises = await import('node:fs/promises')
const fs = await import('node:fs')
const streamPromises = await import('node:stream/promises')
const { default: tar } = await import('tar-fs')

test('extract - error - EISDIR', async () => {
  // @ts-ignore
  fsPromises.mkdir.mockImplementation(() => {})
  // @ts-ignore
  fs.createReadStream.mockImplementation((path) => {
    throw new Error(`EISDIR: illegal operation on a directory, read`)
  })
  await expect(
    Extract.extractTarBr('/test/folder', '/test/folder')
  ).rejects.toThrowError(
    new Error(
      `Failed to extract /test/folder: EISDIR: illegal operation on a directory, read`
    )
  )
})

test('extract', async () => {
  // @ts-ignore
  fsPromises.mkdir.mockImplementation(() => {})
  // @ts-ignore
  fs.createReadStream.mockImplementation((path) => {})
  // @ts-ignore
  tar.extract.mockImplementation(() => {})
  await Extract.extractTarBr('/test/file', '/test/folder')
  expect(fsPromises.mkdir).toHaveBeenCalledTimes(1)
  expect(fsPromises.mkdir).toHaveBeenCalledWith('/test/folder', {
    recursive: true,
  })
  expect(fs.createReadStream).toHaveBeenCalledTimes(1)
  expect(fs.createReadStream).toHaveBeenCalledWith('/test/file')
  expect(tar.extract).toHaveBeenCalledTimes(1)
  expect(tar.extract).toHaveBeenCalledWith('/test/folder')
})
