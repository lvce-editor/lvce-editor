import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
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

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const RecentlyOpened = await import('../src/parts/RecentlyOpened/RecentlyOpened.js')

test('addToRecentlyOpened - already in list', async () => {
  // @ts-ignore
  FileSystem.readJson.mockImplementation(() => {
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
  FileSystem.readJson.mockImplementation(() => {
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
  FileSystem.readJson.mockImplementation(() => {
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

test('removeRecentlyOpened removes equivalent local path and file URI entries', async () => {
  // @ts-ignore
  FileSystem.readJson.mockImplementation(() => {
    return ['/test/folder', 'file:///test/folder/', 'remote-ssh://example/test/folder']
  })
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})

  await RecentlyOpened.removeRecentlyOpened('file:///test/folder')

  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenCalledWith('app://recently-opened.json', expect.stringContaining('remote-ssh://example/test/folder'))
  const writeFileMock = jest.mocked(FileSystem.writeFile)
  expect(JSON.parse(writeFileMock.mock.calls[0][1])).toEqual(['remote-ssh://example/test/folder'])
})

test('removeRecentlyOpened keeps distinct remote authorities', async () => {
  // @ts-ignore
  FileSystem.readJson.mockImplementation(() => {
    return ['remote-ssh://one/test/folder', 'remote-ssh://two/test/folder']
  })
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})

  await RecentlyOpened.removeRecentlyOpened('remote-ssh://one/test/folder')

  expect(FileSystem.writeFile).toHaveBeenCalledWith('app://recently-opened.json', expect.stringContaining('remote-ssh://two/test/folder'))
  const writeFileMock = jest.mocked(FileSystem.writeFile)
  expect(JSON.parse(writeFileMock.mock.calls[0][1])).toEqual(['remote-ssh://two/test/folder'])
})
