import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as EncodingType from '../src/parts/EncodingType/EncodingType.js'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    copy: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
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

jest.unstable_mockModule('../src/parts/FileSystemFileHandle/FileSystemFileHandle.js', () => {
  return {
    getBinaryString: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: PlatformType.Electron,
    assetDir: '',
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const ViewletExplorerHandleDropRootDefault = await import('../src/parts/ViewletExplorer/ViewletExplorerHandleDropRootDefault.js')
const ViewletExplorer = await import('../src/parts/ViewletExplorer/ViewletExplorer.js')
const FileSystemFileHandle = await import('../src/parts/FileSystemFileHandle/FileSystemFileHandle.js')
const Command = await import('../src/parts/Command/Command.js')

test('handleDrop - single folder', async () => {
  const state = {
    ...ViewletExplorer.create(1),
    root: '/test',
    focusedIndex: 1,
    items: [],
    pathSeparator: '/',
  }
  expect(
    await ViewletExplorerHandleDropRootDefault.handleDrop(state, [
      {
        kind: FileHandleType.Directory,
        name: 'folder-1',
      },
    ]),
  ).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(2)
  expect(Command.execute).toHaveBeenNthCalledWith(1, 'PersistentFileHandle.addHandle', '/folder-1', { kind: 'directory', name: 'folder-1' })
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'Workspace.setPath', 'html:///folder-1')
})

test('handleDrop - single file', async () => {
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [
          {
            name: 'file.txt',
            type: DirentType.File,
          },
        ]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  // @ts-ignore
  FileSystemFileHandle.getBinaryString.mockImplementation(() => {
    return 'file 1 content'
  })
  const state = {
    ...ViewletExplorer.create(1),
    root: '/test',
    focusedIndex: 1,
    items: [],
    pathSeparator: '/',
  }
  expect(
    await ViewletExplorerHandleDropRootDefault.handleDrop(state, [
      {
        kind: FileHandleType.File,
        name: 'file-1.txt',
      },
    ]),
  ).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'file.txt',
        path: '/test/file.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenCalledWith('/test/file-1.txt', 'file 1 content', EncodingType.Binary)
  expect(FileSystemFileHandle.getBinaryString).toHaveBeenCalledTimes(1)
  expect(FileSystemFileHandle.getBinaryString).toHaveBeenCalledWith({
    kind: 'file',
    name: 'file-1.txt',
  })
})
