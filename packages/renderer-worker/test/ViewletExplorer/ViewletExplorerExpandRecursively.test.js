import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    rename: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    copy: jest.fn(() => {
      throw new Error('not implemented')
    }),
    remove: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getPathSeparator: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getRealPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletExplorerExpandRecursively = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerExpandRecursively.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

test('expandRecursively', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: '/',
    focused: true,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test/a':
        return [
          {
            name: 'b',
            type: DirentType.Directory,
          },
        ]
      case '/test/a/b':
        return [
          {
            name: 'c',
            type: DirentType.Directory,
          },
          {
            name: 'd.txt',
            type: DirentType.File,
          },
        ]
      case '/test/a/b/c':
        return []
      default:
        throw new Error(`File not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorerExpandRecursively.expandRecursively(state)
  ).toMatchObject({
    focused: true,
    focusedIndex: 0,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'b',
        path: '/test/a/b',
        posInSet: 1,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        icon: '',
        name: 'c',
        path: '/test/a/b/c',
        posInSet: 1,
        setSize: 2,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        icon: '',
        name: 'd.txt',
        path: '/test/a/b/d.txt',
        posInSet: 2,
        setSize: 2,
        type: DirentType.File,
      },
    ],
  })
})

test('expandRecursively - merge with current items', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: '/',
    focused: true,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test/b':
        return [
          {
            name: 'd',
            type: DirentType.Directory,
          },
        ]
      case '/test/b/d':
        return [
          {
            name: 'e',
            type: DirentType.Directory,
          },
        ]
      case '/test/b/d/e':
        return []
      default:
        throw new Error(`File not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorerExpandRecursively.expandRecursively(state)
  ).toMatchObject({
    focused: true,
    focusedIndex: 1,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'd',
        path: '/test/b/d',
        posInSet: 1,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        icon: '',
        name: 'e',
        path: '/test/b/d/e',
        posInSet: 1,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
  })
})

test('expandRecursively - no dirent focused', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: '/',
    focused: true,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    console.log({ uri })
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
            name: 'b',
            type: DirentType.Directory,
          },
        ]
      case '/test/a/b':
        return [
          {
            name: 'c',
            type: DirentType.Directory,
          },
          {
            name: 'd.txt',
            type: DirentType.File,
          },
        ]
      case '/test/a/b/c':
        return []
      default:
        throw new Error(`File not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorerExpandRecursively.expandRecursively(state)
  ).toMatchObject({
    focused: true,
    focusedIndex: -1,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'b',
        path: '/test/a/b',
        posInSet: 1,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        icon: '',
        name: 'c',
        path: '/test/a/b/c',
        posInSet: 1,
        setSize: 2,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        icon: '',
        name: 'd.txt',
        path: '/test/a/b/d.txt',
        posInSet: 2,
        setSize: 2,
        type: DirentType.File,
      },
    ],
  })
})
