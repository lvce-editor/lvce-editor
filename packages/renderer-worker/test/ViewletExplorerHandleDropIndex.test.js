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
const ViewletExplorerHandleDropIndex = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDropIndex.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

test('handleDrop - single file - into folder', async () => {
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [
          {
            name: 'a',
            type: DirentType.Directory,
          },
        ]
      case '/test/a':
        return [
          {
            name: 'file-1.txt',
            type: DirentType.File,
          },
          {
            name: 'file-2.txt',
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
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        type: DirentType.Directory,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        icon: '',
        name: 'file-1.txt',
        path: '/test/a/file-1.txt',
        type: DirentType.File,
      },
    ],
    pathSeparator: '/',
  }
  const newState = await ViewletExplorerHandleDropIndex.handleDropIndex(
    state,
    0,
    [
      {
        lastModified: 0,
        lastModifiedDate: new Date(),
        name: 'file-2.txt',
        path: '/source/file-2.txt',
        size: 4,
        type: 'text/plain',
        webkitRelativePath: '',
      },
    ]
  )
  expect(newState.items).toEqual([
    {
      depth: 1,
      posInSet: 1,
      setSize: 1,
      name: 'a',
      icon: '',
      path: '/test/a',
      type: DirentType.Directory,
    },
    {
      depth: 2,
      posInSet: 1,
      setSize: 2,
      name: 'file-1.txt',
      icon: '',
      path: '/test/a/file-1.txt',
      type: DirentType.File,
    },
    {
      depth: 2,
      posInSet: 2,
      setSize: 2,
      icon: '',
      name: 'file-2.txt',
      path: '/test/a/file-2.txt',
      type: DirentType.File,
    },
  ])
  expect(FileSystem.copy).toHaveBeenCalledTimes(1)
  expect(FileSystem.copy).toHaveBeenCalledWith(
    '/source/file-2.txt',
    '/test/a/file-2.txt'
  )
})
