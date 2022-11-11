import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { jest } from '@jest/globals'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import * as EncodingType from '../src/parts/EncodingType/EncodingType.js'

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
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'electron',
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const Command = await import('../src/parts/Command/Command.js')
const ViewletExplorerHandleDropRootDefault = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDropRootDefault.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

test('handleDrop - single folder', async () => {
  const state = {
    ...ViewletExplorer.create(),
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
    ])
  ).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(2)
  expect(Command.execute).toHaveBeenNthCalledWith(
    1,
    'PersistentFileHandle.addHandle',
    'html://folder-1',
    { kind: 'directory', name: 'folder-1' }
  )
  expect(Command.execute).toHaveBeenNthCalledWith(
    2,
    'Workspace.setPath',
    'html://folder-1'
  )
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
  Command.execute.mockImplementation(() => {
    return 'file 1 content'
  })
  const state = {
    ...ViewletExplorer.create(),
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
    ])
  ).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'file.txt',
        path: '/test/file.txt',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
    ],
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Blob.blobToBinaryString', {
    kind: 'file',
    name: 'file-1.txt',
  })
  expect(FileSystem.writeFile).toHaveBeenCalledTimes(1)
  expect(FileSystem.writeFile).toHaveBeenCalledWith(
    '/test/file-1.txt',
    'file 1 content',
    EncodingType.Binary
  )
})
