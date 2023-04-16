import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.js'

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

const ViewletExplorerExpandRecursively = await import('../src/parts/ViewletExplorer/ViewletExplorerExpandRecursively.js')
const ViewletExplorer = await import('../src/parts/ViewletExplorer/ViewletExplorer.js')

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

test('expandRecursively', async () => {
  const state = {
    ...ViewletExplorer.create(1),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    focused: true,
    items: [
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
  expect(await ViewletExplorerExpandRecursively.expandRecursively(state)).toMatchObject({
    focused: true,
    focusedIndex: 0,
    items: [
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

test('expandRecursively - should work when folder is already expanded', async () => {
  const state = {
    ...ViewletExplorer.create(1),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    focused: true,
    items: [
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
  expect(await ViewletExplorerExpandRecursively.expandRecursively(state)).toMatchObject({
    focused: true,
    focusedIndex: 0,
    items: [
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
    ...ViewletExplorer.create(1),
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    focused: true,
    items: [
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
  expect(await ViewletExplorerExpandRecursively.expandRecursively(state)).toMatchObject({
    focused: true,
    focusedIndex: 1,
    items: [
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
    ...ViewletExplorer.create(1),
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    focused: true,
    items: [
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
  expect(await ViewletExplorerExpandRecursively.expandRecursively(state)).toMatchObject({
    focused: true,
    focusedIndex: -1,
    items: [
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

test('expandRecursively - adjust maxLineY', async () => {
  const state = {
    ...ViewletExplorer.create(1),
    focusedIndex: 0,
    top: 0,
    height: 800,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 14,
    itemHeight: 22,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    focused: true,
    items: [
      {
        depth: 1,
        icon: '',
        name: '.github',
        path: '/test/.github',
        posInSet: 1,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: '.vscode',
        path: '/test/.vscode',
        posInSet: 2,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'node_modules',
        path: '/test/node_modules',
        posInSet: 3,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'packages',
        path: '/test/packages',
        posInSet: 4,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'scripts',
        path: '/test/scripts',
        posInSet: 5,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: '.gitignore',
        path: '/test/.gitignore',
        posInSet: 6,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: '.gitpod.Dockerfile',
        path: '/test/.gitpod.Dockerfile',
        posInSet: 7,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: '.gitpod.yml',
        path: '/test/.gitpod.yml',
        posInSet: 8,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: '.nvmrc',
        path: '/test/.nvmrc',
        posInSet: 9,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'lerna-debug.log',
        path: '/test/lerna-debug.log',
        posInSet: 10,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'lerna.json',
        path: '/test/lerna.json',
        posInSet: 11,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'package-lock.json',
        path: '/test/package-lock.json',
        posInSet: 12,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'package.json',
        path: '/test/package.json',
        posInSet: 13,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'README.md',
        path: '/test/README.md',
        posInSet: 14,
        setSize: 14,
        type: DirentType.File,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test/.github':
        return [
          {
            name: 'workflows',
            type: DirentType.Directory,
          },
        ]
      case '/test/.github/workflows':
        return [
          {
            name: 'ci.yml',
            type: DirentType.File,
          },
          {
            name: 'pr.yml',
            type: DirentType.File,
          },
          {
            name: 'release.yml',
            type: DirentType.File,
          },
        ]
      default:
        throw new Error(`File not found ${uri}`)
    }
  })
  expect(await ViewletExplorerExpandRecursively.expandRecursively(state)).toMatchObject({
    focused: true,
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 18,
    items: [
      {
        depth: 1,
        icon: '',
        name: '.github',
        path: '/test/.github',
        posInSet: 1,
        setSize: 14,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'workflows',
        path: '/test/.github/workflows',
        posInSet: 1,
        setSize: 1,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        icon: '',
        name: 'ci.yml',
        path: '/test/.github/workflows/ci.yml',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 3,
        icon: '',
        name: 'pr.yml',
        path: '/test/.github/workflows/pr.yml',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 3,
        icon: '',
        name: 'release.yml',
        path: '/test/.github/workflows/release.yml',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: '.vscode',
        path: '/test/.vscode',
        posInSet: 2,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'node_modules',
        path: '/test/node_modules',
        posInSet: 3,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'packages',
        path: '/test/packages',
        posInSet: 4,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'scripts',
        path: '/test/scripts',
        posInSet: 5,
        setSize: 14,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: '.gitignore',
        path: '/test/.gitignore',
        posInSet: 6,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: '.gitpod.Dockerfile',
        path: '/test/.gitpod.Dockerfile',
        posInSet: 7,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: '.gitpod.yml',
        path: '/test/.gitpod.yml',
        posInSet: 8,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: '.nvmrc',
        path: '/test/.nvmrc',
        posInSet: 9,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'lerna-debug.log',
        path: '/test/lerna-debug.log',
        posInSet: 10,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'lerna.json',
        path: '/test/lerna.json',
        posInSet: 11,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'package-lock.json',
        path: '/test/package-lock.json',
        posInSet: 12,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'package.json',
        path: '/test/package.json',
        posInSet: 13,
        setSize: 14,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'README.md',
        path: '/test/README.md',
        posInSet: 14,
        setSize: 14,
        type: DirentType.File,
      },
    ],
  })
})
