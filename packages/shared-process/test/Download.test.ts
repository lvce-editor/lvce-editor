import { afterEach, expect, jest, test } from '@jest/globals'

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

const Download = await import('../src/parts/Download/Download.js')
const fsPromises = await import('node:fs/promises')
const fs = await import('node:fs')
const streamPromises = await import('node:stream/promises')

// TODO mock network process
test.skip('download', async () => {
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
