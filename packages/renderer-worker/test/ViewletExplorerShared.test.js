import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as FileSystemErrorCodes from '../src/parts/FileSystemErrorCodes/FileSystemErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    stat: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletExplorerShared = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerShared.js'
)
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

class NodeError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

test('getChildDirentsRaw - resolve symbolic links', async () => {
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'file-1.txt',
        type: DirentType.File,
      },
      {
        name: 'link-1.txt',
        type: DirentType.Symlink,
      },
    ]
  })
  // @ts-ignore
  FileSystem.stat.mockImplementation(() => {
    return DirentType.File
  })
  expect(await ViewletExplorerShared.getChildDirentsRaw('/test')).toEqual([
    {
      name: 'file-1.txt',
      type: DirentType.File,
    },
    {
      name: 'link-1.txt',
      type: DirentType.SymLinkFile,
    },
  ])
  expect(FileSystem.stat).toHaveBeenCalledTimes(1)
  expect(FileSystem.stat).toHaveBeenCalledWith('/test/link-1.txt')
})

test('getChildDirentsRaw - resolve symbolic links - error - ENOENT', async () => {
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'file-1.txt',
        type: DirentType.File,
      },
      {
        name: 'link-1.txt',
        type: DirentType.Symlink,
      },
    ]
  })
  // @ts-ignore
  FileSystem.stat.mockImplementation(() => {
    throw new NodeError(FileSystemErrorCodes.ENOENT)
  })
  expect(await ViewletExplorerShared.getChildDirentsRaw('/test')).toEqual([
    {
      name: 'file-1.txt',
      type: DirentType.File,
    },
    {
      name: 'link-1.txt',
      type: DirentType.SymLinkFile,
    },
  ])
  expect(FileSystem.stat).toHaveBeenCalledTimes(1)
  expect(FileSystem.stat).toHaveBeenCalledWith('/test/link-1.txt')
})

test('compare dirent - symlink to file and file should be ordered next to each other', async () => {
  expect(
    ViewletExplorerShared.compareDirent(
      {
        name: 'file-1.txt',
        type: DirentType.File,
      },
      {
        name: 'file-1.txt',
        type: DirentType.SymLinkFile,
      }
    )
  ).toBe(0)
})

test('compare dirent - symlink to directory and directory should be ordered next to each other', async () => {
  expect(
    ViewletExplorerShared.compareDirent(
      {
        name: 'folder-1',
        type: DirentType.Directory,
      },
      {
        name: 'folder-1',
        type: DirentType.SymLinkFolder,
      }
    )
  ).toBe(0)
})
