import { jest } from '@jest/globals'
import { RequestError } from 'got'

afterEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs/promises', () => ({
  mkdir: jest.fn(() => {
    throw new Error('not implemented')
  }),
  rm: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('node:fs', () => ({
  createWriteStream: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('node:stream/promises', () => ({
  pipeline: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('got', () => ({
  default: {
    stream: jest.fn(),
  },
  RequestError: class extends Error {
    constructor(message) {
      super(message)
    }
  },
}))

const Download = await import('../src/parts/Download/Download.js')
const fsPromises = await import('node:fs/promises')
const fs = await import('node:fs')
const streamPromises = await import('node:stream/promises')

test('download - error - EISDIR', async () => {
  // @ts-ignore
  fsPromises.mkdir.mockImplementation((path) => {
    throw new Error(`EISDIR: illegal operation on a directory, open '${path}'`)
  })
  await expect(
    Download.download('https://example/file.txt', '/test/folder')
  ).rejects.toThrowError(
    new Error(
      `Failed to download "https://example/file.txt": EISDIR: illegal operation on a directory, open '/test'`
    )
  )
})

test('download - error - socket hang up', async () => {
  // @ts-ignore
  fsPromises.mkdir.mockImplementation((path) => {
    // @ts-ignore
    throw new RequestError(`socket hang up`, {}, {})
  })
  await expect(
    Download.download('https://example/file.txt', '/test/folder')
  ).rejects.toThrowError(
    new Error(
      `Failed to download "https://example/file.txt": EISDIR: illegal operation on a directory, open '/test'`
    )
  )
})

test('download', async () => {
  // @ts-ignore
  fsPromises.mkdir.mockImplementation(() => {})
  // @ts-ignore
  fs.createWriteStream.mockImplementation(() => {})
  // @ts-ignore
  streamPromises.pipeline.mockImplementation(() => {})
  await Download.download('https://example/file.txt', '/test/folder')
  expect(fsPromises.mkdir).toHaveBeenCalled()
  expect(streamPromises.pipeline).toHaveBeenCalled()
})
