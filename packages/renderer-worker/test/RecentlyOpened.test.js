import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/LocalStorage/LocalStorage.js', () => {
  return {
    getJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getText: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: PlatformType.Web,
    getPlatform: () => {
      return PlatformType.Web
    },
    assetDir: '',
  }
})

jest.unstable_mockModule('../src/parts/PlatformPaths/PlatformPaths.js', () => {
  return {
    getRecentlyOpenedPath: jest.fn(() => {
      return 'app://recently-opened.json'
    }),
  }
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    readJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystemAppShared.js', () => {
  return {
    readJsonInternal: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFileInternal: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const FileSystemAppShared = await import('../src/parts/FileSystem/FileSystemAppShared.js')
const RecentlyOpened = await import('../src/parts/RecentlyOpened/RecentlyOpened.js')

test('addToRecentlyOpened - already in list', async () => {
  // @ts-ignore
  FileSystemAppShared.readJsonInternal.mockImplementation(() => {
    return ['/test/folder-1', '/test/folder-2', '/test/folder-3']
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
`,
  )
})

test('addToRecentlyOpened - already at front of list', async () => {
  // @ts-ignore
  FileSystemAppShared.readJsonInternal.mockImplementation(() => {
    return ['/test/folder-3', '/test/folder-1', '/test/folder-2']
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
`,
  )
})

test('addToRecentlyOpened - error - recently opened path is of type array', async () => {
  // @ts-ignore
  FileSystem.readJson.mockImplementation(() => {
    throw new Error('expected value to be of type string')
  })
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new Error('Failed to read recently opened: expected value to be of type string'))
})

test('addToRecentlyOpened - error - invalid json when reading recently opened', async () => {
  // @ts-ignore
  FileSystemAppShared.readJsonInternal.mockImplementation(() => {
    return []
  })
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  expect(FileSystem.writeFile).toHaveBeenCalledWith(
    'app://recently-opened.json',
    `[
  "/test/folder-3"
]
`,
  )
})

