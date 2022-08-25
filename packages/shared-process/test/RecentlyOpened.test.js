import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:fs/promises', () => {
  return {
    cp: jest.fn(() => {
      throw new Error('not implemented')
    }),
    mkdir: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readlink: jest.fn(() => {
      throw new Error('not implemented')
    }),
    realpath: jest.fn(() => {
      throw new Error('not implemented')
    }),
    rename: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getRecentlyOpenedPath: () => {
      return '/test/recently-opened.json'
    },
  }
})

const RecentlyOpened = await import(
  '../src/parts/RecentlyOpened/RecentlyOpened.js'
)
const fs = await import('node:fs/promises')

class NodeError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

test('addPath - error - file does not exist yet', async () => {
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    throw new NodeError('ENOENT')
  })
  await RecentlyOpened.addPath('/test/new-path.txt')
})

test('addPath - error - recently opened file has invalid json', async () => {
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    return `[
      "file-1.txt",
      "file-1.txt",
      "file-1.txt",
      "file-1.txt",
      "file-1.txt",
      "file-1.txt",
      "file-1.txt",
      "file-1.txt",
      `
  })
  // @ts-ignore
  fs.writeFile.mockImplementation(() => {})
  await RecentlyOpened.addPath('/test/new-path.txt')
  expect(fs.writeFile).toHaveBeenCalledTimes(1)
  expect(fs.writeFile).toHaveBeenCalledWith(
    '/test/recently-opened.json',
    `[
  \"/test/new-path.txt\"
]
`
  )
})

test('addPath - error - permission denied', async () => {
  // @ts-ignore
  fs.readFile.mockImplementation(() => {
    throw new NodeError('EPERM')
  })
  await expect(
    RecentlyOpened.addPath('/test/new-path.txt')
  ).rejects.toThrowError(
    new Error(
      'Failed to read recently opened: Failed to read file "/test/recently-opened.json": EPERM'
    )
  )
})
