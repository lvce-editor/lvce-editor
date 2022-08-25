import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'web',
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

const RecentlyOpened = await import(
  '../src/parts/RecentlyOpened/RecentlyOpened.js'
)

test('addToRecentlyOpened - already in list', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return JSON.stringify([
      '/test/folder-1',
      '/test/folder-2',
      '/test/folder-3',
    ])
  })
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  expect(FileSystem.writeFile).toHaveBeenCalledWith(
    'app://recently-opened.json',
    `[
  "/test/folder-3",
  "/test/folder-1",
  "/test/folder-2"
]
`
  )
})

test('addToRecentlyOpened - already at front of list', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return JSON.stringify([
      '/test/folder-3',
      '/test/folder-1',
      '/test/folder-2',
    ])
  })
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  // TODO not necessary to write again, because it is already at front of list
  expect(FileSystem.writeFile).toHaveBeenCalledWith(
    'app://recently-opened.json',
    `[
  "/test/folder-3",
  "/test/folder-1",
  "/test/folder-2"
]
`
  )
})

test('addToRecentlyOpened - error - recently opened path is of type array', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    throw new Error('expected value to be of type string')
  })
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    new Error(
      'Failed to read recently opened: expected value to be of type string'
    )
  )
})

test('addToRecentlyOpened - error - invalid json when reading recently opened', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return (
      JSON.stringify(['/test/folder-1', '/test/folder-2', '/test/folder-3']) +
      '##'
    )
  })
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  expect(FileSystem.writeFile).toHaveBeenCalledWith(
    'app://recently-opened.json',
    `[
  "/test/folder-3"
]
`
  )
})
