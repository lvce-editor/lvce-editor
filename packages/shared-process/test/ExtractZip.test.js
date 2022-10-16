import { jest } from '@jest/globals'

afterEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs/promises', () => ({
  mkdir: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('extract-zip', () => ({
  default: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtractZip = await import('../src/parts/ExtractZip/ExtractZip.js')
const fsPromises = await import('node:fs/promises')
const { default: extract } = await import('extract-zip')

test('extractZip - error - ENOENT', async () => {
  // @ts-ignore
  fsPromises.mkdir.mockImplementation(() => {})
  // @ts-ignore
  fsPromises.mkdir.mockImplementation((path) => {
    throw new Error(`ENOENT: no such file or directory`)
  })
  await expect(
    ExtractZip.extractZip({ inFile: '/test/file', outDir: '/test/folder' })
  ).rejects.toThrowError(
    new Error(`Failed to extract /test/file: ENOENT: no such file or directory`)
  )
})

test('extractZip', async () => {
  // @ts-ignore
  fsPromises.mkdir.mockImplementation(() => {})
  // @ts-ignore
  extract.mockImplementation(() => {})
  await ExtractZip.extractZip({ inFile: '/test/file', outDir: '/test/folder' })
  expect(fsPromises.mkdir).toHaveBeenCalledTimes(1)
  expect(fsPromises.mkdir).toHaveBeenCalledWith('/test/folder', {
    recursive: true,
  })
  expect(extract).toHaveBeenCalledTimes(1)
  expect(extract).toHaveBeenCalledWith('/test/file', { dir: '/test/folder' })
})
