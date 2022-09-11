import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { jest } from '@jest/globals'

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
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const ViewletExplorerHandleDrop = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDrop.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

test('handleDrop - single file', async () => {
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {})
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
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
    focusedIndex: 1,
    dirents: [],
    pathSeparator: '/',
  }
  expect(
    await ViewletExplorerHandleDrop.handleDrop(state, [
      {
        lastModified: 1662556917899,
        lastModifiedDate: new Date(),
        name: 'file.txt',
        path: '/source/file.txt',
        size: 4,
        type: 'text/plain',
        webkitRelativePath: '',
      },
    ])
  ).toMatchObject({
    dirents: [
      {
        path: '/test/file.txt',
      },
    ],
  })
  expect(FileSystem.copy).toHaveBeenCalledTimes(1)
  expect(FileSystem.copy).toHaveBeenCalledWith(
    '/source/file.txt',
    '/test/file.txt'
  )
})

test('handleDrop - single file - merge with existing files', async () => {
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [
          {
            name: 'file-1.txt',
            type: DirentType.File,
          },
          {
            name: 'file-2.txt',
            type: DirentType.File,
          },
          {
            name: 'file-3.txt',
            type: DirentType.File,
          },
        ]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
    focusedIndex: 1,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 2,
        name: 'file-1.txt',
        path: '/test/file-1.txt',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 2,
        name: 'file-3.txt',
        path: '/test/file-3.txt',
        type: DirentType.File,
      },
    ],
    pathSeparator: '/',
  }
  expect(
    await ViewletExplorerHandleDrop.handleDrop(state, [
      {
        lastModified: 1662556917899,
        lastModifiedDate: new Date(),
        name: 'file-2.txt',
        path: '/source/file-2.txt',
        size: 4,
        type: 'text/plain',
        webkitRelativePath: '',
      },
    ])
  ).toMatchObject({
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'file-1.txt',
        path: '/test/file-1.txt',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'file-2.txt',
        path: '/test/file-2.txt',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'file-3.txt',
        path: '/test/file-3.txt',
        type: DirentType.File,
      },
    ],
  })
  expect(FileSystem.copy).toHaveBeenCalledTimes(1)
  expect(FileSystem.copy).toHaveBeenCalledWith(
    '/source/file-2.txt',
    '/test/file-2.txt'
  )
})

test('handleDrop - error', async () => {
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const state = {
    root: '/test',
    focusedIndex: 1,
    dirents: [],
  }
  await expect(
    ViewletExplorerHandleDrop.handleDrop(state, [
      {
        lastModified: 1662556917899,
        lastModifiedDate: new Date(),
        name: 'file.txt',
        path: '/test/file.txt',
        size: 4,
        type: 'text/plain',
        webkitRelativePath: '',
      },
    ])
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
