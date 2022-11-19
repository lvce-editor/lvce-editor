import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { CancelationError } from '../src/parts/Errors/CancelationError.js'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.js'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.js'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'

beforeEach(() => {
  jest.resetAllMocks()
  GlobalEventBus.state.listenerMap = Object.create(null)
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    setState: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getState: jest.fn(() => {
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
    getPathSeparator: () => {
      return '/'
    },
    getRealPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Workspace = await import('../src/parts/Workspace/Workspace.js')

const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

const GlobalEventBus = await import(
  '../src/parts/GlobalEventBus/GlobalEventBus.js'
)

const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)
const Command = await import('../src/parts/Command/Command.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

class NodeError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletExplorer, oldState, newState)
}

test('create', () => {
  const state = ViewletExplorer.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'file 1',
        type: DirentType.File,
      },
      {
        name: 'file 2',
        type: DirentType.File,
      },
      {
        name: 'file 3',
        type: DirentType.File,
      },
    ]
  })
  expect(await ViewletExplorer.loadContent(state)).toEqual({
    deltaY: 0,
    version: 0,
    itemHeight: 22,
    dropTargets: [],
    items: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: '/test/file 1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: '/test/file 2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: '/test/file 3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
    focusedIndex: -1,
    focused: false,
    height: undefined,
    hoverIndex: -1,
    left: undefined,
    maxLineY: Number.NaN,
    minLineY: 0,
    root: '/test',
    top: undefined,
    pathSeparator: PathSeparatorType.Slash,
    editingIndex: -1,
    excluded: [],
    editingValue: '',
    editingType: ExplorerEditingType.None,
  })
})

// TODO handle ENOENT error
// TODO handle ENOTDIR error

test('loadContent - restore from saved state', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
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
          {
            name: 'b.txt',
            type: DirentType.File,
          },
        ]
      case '/test/a':
        return [
          {
            name: 'c',
            type: DirentType.Directory,
          },
        ]
      default:
        throw new Error('file not found')
    }
  })

  const savedState = {
    root: '/test',
    expandedPaths: ['/test/a'],
  }
  expect(await ViewletExplorer.loadContent(state, savedState)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 2,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'c',
        path: '/test/a/c',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b.txt',
        path: '/test/b.txt',
        posInSet: 2,
        setSize: 2,
        type: DirentType.File,
      },
    ],
  })
})

test('loadContent - restore from saved state - error root not found', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        throw new NodeError(ErrorCodes.ENOENT)
      case '/test/a':
        return [
          {
            name: 'c',
            type: DirentType.Directory,
          },
        ]
      default:
        throw new Error('file not found')
    }
  })

  const savedState = {
    root: '/test',
    expandedPaths: ['/test/a'],
  }
  await expect(
    ViewletExplorer.loadContent(state, savedState)
  ).rejects.toThrowError(new Error('ENOENT'))
})

test('loadContent - restore from saved state - sort dirents', async () => {
  const state = ViewletExplorer.create()
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [
          {
            name: 'b',
            type: DirentType.Directory,
          },
          {
            name: 'a',
            type: DirentType.Directory,
          },
        ]
      case '/test/a':
        return [
          {
            name: 'd',
            type: DirentType.Directory,
          },
          {
            name: 'c',
            type: DirentType.Directory,
          },
        ]
      default:
        throw new Error('file not found')
    }
  })

  const savedState = {
    root: '/test',
    expandedPaths: ['/test/a'],
  }
  expect(await ViewletExplorer.loadContent(state, savedState)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 2,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'c',
        path: '/test/a/c',
        posInSet: 1,
        setSize: 2,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'd',
        path: '/test/a/d',
        posInSet: 2,
        setSize: 2,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 2,
        type: DirentType.Directory,
      },
    ],
  })
})

test('loadContent - restore from saved state - no saved state exists', async () => {
  const state = ViewletExplorer.create()
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [
          {
            name: 'a',
            type: DirentType.Directory,
          },
          {
            name: 'b.txt',
            type: DirentType.File,
          },
        ]
      default:
        throw new Error('file not found')
    }
  })

  const savedState = undefined
  expect(await ViewletExplorer.loadContent(state, savedState)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 2,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b.txt',
        path: '/test/b.txt',
        posInSet: 2,
        setSize: 2,
        type: DirentType.File,
      },
    ],
  })
})

test('loadContent - restore from saved state - error - ENOENT for child folder', async () => {
  const state = ViewletExplorer.create()
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(async (uri) => {
    switch (uri) {
      case '/test':
        return [
          {
            name: 'a',
            type: DirentType.Directory,
          },
          {
            name: 'b',
            type: DirentType.Directory,
          },
        ]
      case '/test/a':
        return [
          {
            name: 'c',
            type: DirentType.Directory,
          },
        ]
      case '/test/b':
        return [
          {
            name: 'd',
            type: DirentType.Directory,
          },
        ]
      case '/test/a/c':
        throw new NodeError('ENOENT')
      case '/test/b/d':
        return [
          {
            name: 'f',
            type: DirentType.Directory,
          },
        ]
      default:
        console.log({ uri })
        throw new Error('file not found')
    }
  })

  const savedState = {
    root: '/test',
    expandedPaths: ['/test/a', '/test/a/c', '/test/b', '/test/b/d'],
  }
  expect(await ViewletExplorer.loadContent(state, savedState)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 2,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'c',
        path: '/test/a/c',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 2,
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
        name: 'f',
        path: '/test/b/d/f',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
    ],
  })
})

test.skip('loadContent - race condition - workspace changes while loading after getting path separator', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [
          {
            name: 'file 1',
            type: DirentType.File,
          },
          {
            name: 'file 2',
            type: DirentType.File,
          },
          {
            name: 'file 3',
            type: DirentType.File,
          },
        ]
      case 'FileSystem.getPathSeparator':
        Workspace.state.workspacePath = '/test-2'
        return '/'
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new CancelationError()
  )
})

test.skip('loadContent - race condition - workspace changes while loading after reading dirents', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        Workspace.state.workspacePath = '/test-2'
        return [
          {
            name: 'file 1',
            type: DirentType.File,
          },
          {
            name: 'file 2',
            type: DirentType.File,
          },
          {
            name: 'file 3',
            type: DirentType.File,
          },
        ]
      case 'FileSystem.getPathSeparator':
        return '/'
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new CancelationError()
  )
})

// TODO race conditions can happen at several locations, find good pattern/architecture
// to avoid race conditions, otherwise might miss some
test.skip('loadContent - race condition', async () => {
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})

  let x = 0
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        if (x++ === 0) {
          return [
            {
              name: 'file 1',
              type: DirentType.File,
            },
          ]
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1))
          return [
            {
              name: 'file 1',
              type: DirentType.File,
            },
            {
              name: 'file 2',
              type: DirentType.File,
            },
          ]
        }
      case 'FileSystem.getPathSeparator':
        return '/'
      default:
        throw new Error('unexpected message')
    }
  })

  const load = async (state) => {
    const version = ++state.version
    const newState = await ViewletExplorer.loadContent(state)
    if (state.version !== version) {
      return
    }
    await ViewletExplorer.contentLoaded(newState)
  }
  const state = ViewletExplorer.create('', '', 0, 0, 100, 100)
  const promise1 = load(state)
  const promise2 = load(state)
  await Promise.all([promise1, promise2])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: '/test/file 1',
        posInSet: 1,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: '/test/file 2',
        posInSet: 2,
        setSize: 2,
        type: DirentType.File,
      },
    ]
  )
})

test('loadContent - error - typeError', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('loadContent - error - syntaxError', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    throw new SyntaxError('unexpected token x')
  })

  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new SyntaxError('unexpected token x')
  )
})

test('loadContent - error - command not found', async () => {
  const state = ViewletExplorer.create()
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    throw new Error('command -1 not found')
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new Error('command -1 not found')
  )
})

// TODO add test for contentLoaded with windows paths separators ('\')

test.skip('contentLoaded', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletExplorer.create(),
    deltaY: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: 'file 1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: 'file 2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: 'file 3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
    focusedIndex: 0,
    height: 200,
    hoverIndex: -1,
    left: 0,
    maxLineY: 10,
    minLineY: 0,
    root: '/test',
    top: 0,
  }
  await ViewletExplorer.contentLoaded(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: 'file 1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: 'file 2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: 'file 3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ]
  )
})

// TODO should handle error gracefully
test.skip('refresh - error', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/home/test-user/test-path'
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  await ViewletExplorer.refresh(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    'Viewlet.send',
    'Explorer',
    'handleError',
    new Error('TypeError: x is not a function'),
  ])
})

test('handleClick - no element focused', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  }
  expect(await ViewletExplorer.handleClick(state, -1)).toMatchObject({
    focusedIndex: -1,
  })
})

test('handleClick - file', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Main.openUri':
        break
      default:
        throw new Error('unexpected method')
    }
  })
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    focusedIndex: 0,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Main.openUri',
    '/index.css',
    true
  )
})

test('handleClick - file - error', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Main.openUri':
        break
      default:
        throw new Error('unexpected method')
    }
  })
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    focusedIndex: 0,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Main.openUri',
    '/index.css',
    true
  )
})

test('handleClick - unsupported dirent type', async () => {
  const state = {
    root: '/test',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        name: 'index.css',
        type: 'abc',
        path: '/index.css',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Main.openUri':
        break
      default:
        throw new Error('unexpected method')
    }
  })
  expect(() => ViewletExplorer.handleClick(state, 0)).toThrowError(
    new Error('unsupported dirent type abc')
  )
  expect(Command.execute).not.toHaveBeenCalled()
})

test('handleClick - symlink - file', async () => {
  const state = {
    root: '/test',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.SymLinkFile,
        path: '/index.css',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Main.openUri':
        break
      default:
        throw new Error('unexpected method')
    }
  })
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    focusedIndex: 0,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Main.openUri',
    '/index.css',
    true
  )
})

test('handleClickCurrentButKeepFocus - file', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focused: true,
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/test/index.css',
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Main.openUri':
        break
      default:
        throw new Error('unexpected method')
    }
  })
  expect(await ViewletExplorer.handleClickCurrentButKeepFocus(state)).toEqual(
    state
  )
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Main.openUri',
    '/test/index.css',
    false
  )
})

// TODO test error
test('handleClick - directory', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        name: 'folder-1',
        type: DirentType.Directory,
        path: '/folder-1',
        setSize: 3,
        posInSet: 1,
        depth: 1,
      },
      {
        name: 'folder-2',
        type: DirentType.Directory,
        path: '/folder-2',
        setSize: 3,
        posInSet: 2,
        depth: 1,
      },
      {
        name: 'folder-3',
        type: DirentType.Directory,
        path: '/folder-3',
        setSize: 3,
        posInSet: 3,
        depth: 1,
      },
    ],
  }
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    return state
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [{ name: 'index.js', type: DirentType.File }]
  })
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1/index.js',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
  })
})

test('handleClick - directory-expanded', async () => {
  const state = {
    root: '/test',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        name: 'test/folder',
        type: DirentType.DirectoryExpanded,
        path: '/test/folder',
        depth: 1,
        setSize: 1,
        posInSet: 1,
      },
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/test/folder/index.css',
        depth: 2,
        setSize: 2,
        posInSet: 1,
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/test/folder/index.html',
        depth: 2,
        setSize: 2,
        posInSet: 2,
      },
    ],
  }
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    focusedIndex: 0,
    items: [
      {
        name: 'test/folder',
        type: DirentType.Directory,
        path: '/test/folder',
        depth: 1,
        setSize: 1,
        posInSet: 1,
      },
    ],
  })
})

test.skip('handleClick - directory-expanded - scrolled down', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        name: 'folder-1',
        type: DirentType.Directory,
        path: '/folder-1',
        setSize: 2,
        posInSet: 1,
        depth: 1,
      },
      {
        name: 'folder-2',
        type: DirentType.DirectoryExpanded,
        path: '/folder-2',
        setSize: 2,
        posInSet: 2,
        depth: 1,
      },
      {
        name: 'a.txt',
        type: DirentType.File,
        path: '/folder-2/a.txt',
        setSize: 2,
        posInSet: 1,
        depth: 2,
      },
      {
        name: 'b.txt',
        type: DirentType.File,
        path: '/folder-2/b.txt',
        setSize: 2,
        posInSet: 2,
        depth: 2,
      },
    ],
    minLineY: 1,
  }
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    items: [
      {
        depth: 1,
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 2,
        type: DirentType.Directory,
        icon: '',
      },
    ],
  })
})

test('handleClick - collapsed folder', async () => {
  const state = {
    ...ViewletExplorer.create(),
    path: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.Directory,
      },
    ],
  }
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    return state
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [{ name: 'index.js', type: DirentType.File }]
  })
  expect(await ViewletExplorer.handleClick(state, 2)).toMatchObject({
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        icon: '',
        name: 'index.js',
        path: '/test-folder/index.js',
        type: DirentType.File,
      },
    ],
    focusedIndex: 2,
  })
})

test.skip('handleClick - race condition - child folder is being expanded and parent folder is being collapsed', async () => {
  const state = {
    path: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        icon: '',
        name: 'parent-directory',
        path: '/parent-directory',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 2,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        type: DirentType.Directory,
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 2,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        type: DirentType.Directory,
      },
    ],
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [{ name: 'index.js', type: DirentType.File }]
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const promise1 = ViewletExplorer.handleClick(state, 1)
  const promise2 = ViewletExplorer.handleClick(state, 0)
  await Promise.all([promise1, promise2])
  expect(state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        icon: '',
        name: 'parent-directory',
        path: '/parent-directory',
        type: DirentType.Directory,
      },
    ]
  )
})
// TODO test expanding folder

test.skip('handleClick - folder - race condition - opening multiple folders at the same time', async () => {
  const state = {
    path: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        type: DirentType.Directory,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        type: DirentType.Directory,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        type: DirentType.Directory,
      },
    ],
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [{ name: 'index.js', type: DirentType.File }]
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const promise1 = ViewletExplorer.handleClick(state, 0)
  const promise2 = ViewletExplorer.handleClick(state, 1)
  const promise3 = ViewletExplorer.handleClick(state, 2)
  await Promise.all([promise1, promise2, promise3])
  expect(state.focusedIndex).toBe(2)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    1,
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1,index.js', // TODO
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
    ]
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1,index.js', // TODO
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-2,index.js', // TODO
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
    ]
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    3,
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1,index.js',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-2,index.js',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-3,index.js',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ]
  )
})

test('handleClick - expanded folder', async () => {
  const state = {
    path: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        languageId: 'unknown',
        name: 'index.js',
        path: '/test-folder/index.js',
        type: DirentType.File,
      },
    ],
  }
  expect(await ViewletExplorer.handleClick(state, 2)).toMatchObject({
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.Directory,
        icon: '',
      },
    ],
  })
})

test('handleArrowLeft - root file', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: DirentType.File,
      },
    ],
  }
  const newState = await ViewletExplorer.handleArrowLeft(state)
  expect(newState).toBe(state)
})

test('handleArrowLeft - collapsed root folder', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.Directory,
      },
    ],
  }
  const newState = await ViewletExplorer.handleArrowLeft(state)
  expect(newState).toBe(state)
})

test('handleArrowLeft - expanded root folder with nested child folders inside', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 4,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 4,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 4,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 2,
        name: 'a',
        path: '/test-folder/a',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        posInSet: 1,
        setSize: 2,
        name: 'a',
        path: '/test-folder/a/b',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        posInSet: 2,
        setSize: 2,
        name: 'c.html',
        path: '/test-folder/a/c.html',
        type: DirentType.File,
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 2,
        name: 'd.html',
        path: '/test-folder/d.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 4,
        setSize: 4,
        name: 'other-file.html',
        path: '/other-file.html',
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorer.handleArrowLeft(state)).toMatchObject({
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 4,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 4,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 4,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.Directory,
        icon: '',
      },
      {
        depth: 1,
        posInSet: 4,
        setSize: 4,
        name: 'other-file.html',
        path: '/other-file.html',
        type: DirentType.File,
      },
    ],
  })
})

test('handleArrowLeft - scroll up', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
    focusedIndex: 2,
    top: 0,
    height: 80,
    deltaY: 40,
    minLineY: 2,
    maxLineY: 6,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 4,
        name: 'index.css',
        path: '/test/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 4,
        name: 'index.html',
        path: '/test/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 4,
        name: 'folder',
        path: '/test/folder',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 2,
        name: 'a',
        path: '/test/folder/a',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        posInSet: 1,
        setSize: 2,
        name: 'a',
        path: '/test/folder/a/b',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 3,
        posInSet: 2,
        setSize: 2,
        name: 'c.html',
        path: '/test/folder/a/c.html',
        type: DirentType.File,
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 2,
        name: 'd.html',
        path: '/test/folder/d.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 4,
        setSize: 4,
        name: 'other-file.html',
        path: '/test/other-file.html',
        type: DirentType.File,
      },
    ],
  }
  const newState = ViewletExplorer.handleArrowLeft(state)
  expect(newState.items).toEqual([
    {
      depth: 1,
      posInSet: 1,
      setSize: 4,
      name: 'index.css',
      path: '/test/index.css',
      type: DirentType.File,
    },
    {
      depth: 1,
      posInSet: 2,
      setSize: 4,
      name: 'index.html',
      path: '/test/index.html',
      type: DirentType.File,
    },
    {
      depth: 1,
      posInSet: 3,
      setSize: 4,
      name: 'folder',
      path: '/test/folder',
      type: DirentType.Directory,
      icon: '',
    },
    {
      depth: 1,
      posInSet: 4,
      setSize: 4,
      name: 'other-file.html',
      path: '/test/other-file.html',
      type: DirentType.File,
    },
  ])
  expect(newState.minLineY).toBe(0)
  expect(newState.maxLineY).toBe(4)
  expect(newState.deltaY).toBe(0)
})

test('handleArrowLeft - nested file - first child', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: 3,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorer.handleArrowLeft(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('handleArrowLeft - nested file - third child', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: 6,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 4,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 4,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        name: 'test-folder',
        path: '/test-folder',
        setSize: 4,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 3,
        name: 'a.html',
        path: '/test-folder/a.html',
        type: DirentType.File,
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 3,
        name: 'folder-b',
        path: '/test-folder/folder-b',
        type: DirentType.File,
      },
      {
        depth: 3,
        posInSet: 1,
        setSize: 1,
        name: 'file-b-1.html',
        path: '/test-folder/folder-b/file-b-1.html',
        type: DirentType.File,
      },
      {
        depth: 2,
        posInSet: 3,
        setSize: 3,
        name: 'c.html',
        path: '/test-folder/c.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 4,
        setSize: 4,
        name: 'other-file.html',
        path: '/other-file.html',
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorer.handleArrowLeft(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('handleArrowLeft - when no focus', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
      },
    ],
  }
  expect(await ViewletExplorer.handleArrowLeft(state)).toBe(state)
})

test('handleArrowLeft - symbolic link', async () => {
  const state = {
    root: '/test',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'abc',
        path: '/test/abc',
        type: DirentType.Symlink,
      },
    ],
  }
  expect(await ViewletExplorer.handleArrowLeft(state)).toBe(state)
})

test('handleArrowRight - file', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: DirentType.File,
      },
    ],
  }
  const newState = await ViewletExplorer.handleArrowRight(state)
  expect(newState).toBe(state)
})

test('handleArrowRight - symlink - file', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.SymLinkFile,
      },
    ],
  }
  expect(await ViewletExplorer.handleArrowRight(state)).toBe(state)
})

test('handleArrowRight - collapsed folder', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
        icon: '',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
        icon: '',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.Directory,
        icon: '',
      },
    ],
  }
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    return state
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [{ name: 'index.js', type: DirentType.File }]
  })
  expect(await ViewletExplorer.handleArrowRight(state)).toMatchObject({
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
        icon: '',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
        icon: '',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
        icon: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: DirentType.File,
        icon: '',
      },
    ],
  })
})

// TODO test for race condition: when viewlet state changes while loading children
test('handleArrowRight - collapsed empty folder', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.Directory,
      },
    ],
    pathSeparator: PathSeparatorType.Slash,
  }
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    return state
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return []
  })
  expect(await ViewletExplorer.handleArrowRight(state)).toMatchObject({
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: DirentType.File,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: DirentType.DirectoryExpanded,
        icon: '',
      },
    ],
  })
})

test('handleArrowRight - expanded folder', async () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 2,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        index: 0,
        languageId: 'unknown',
        name: 'index.js',
        path: '/test-folder/index.js',
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  expect(await ViewletExplorer.handleArrowRight(state)).toMatchObject({
    focusedIndex: 3,
  })
})

test('handleArrowRight - expanded empty folder', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 2,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
    ],
  }
  expect(await ViewletExplorer.handleArrowRight(state)).toBe(state)
})

test('handleArrowRight - when no focus', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 2,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        index: 0,
        languageId: 'unknown',
        name: 'index.js',
        path: '/test-folder/index.js',
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  expect(await ViewletExplorer.handleArrowRight(state)).toBe(state)
})

test('handleWheel - up', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 22,
    deltaY: 22,
    minLineY: 0,
    maxLineY: 2,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  const newState = ViewletExplorer.handleWheel(state, -22)
  expect(render(state, newState)).toEqual([
    [
      'Viewlet.send',
      'Explorer',
      'updateDirents',
      [
        {
          depth: 1,
          index: 0,
          languageId: 'unknown',
          name: 'index.css',
          path: '/index.css',
          setSize: 3,
          type: DirentType.File,
        },
      ],
    ],
  ])
})

test('handleWheel - up - already at top', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 2,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorer.handleWheel(state, -10)).toBe(state)
})

test.skip('handleWheel - down', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 22,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 2,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  const newState = ViewletExplorer.handleWheel(state, 22)
  console.log({ newState })
  expect(render(state, newState)).toEqual([
    [
      'Viewlet.send',
      'Explorer',
      'updateDirents',
      [
        {
          depth: 1,
          index: 0,
          languageId: 'unknown',
          name: 'index.css',
          path: '/index.css',
          setSize: 3,
          type: DirentType.File,
        },
      ],
    ],
    ['Viewlet.send', 'Explorer', 'setFocusedIndex', -1, -1],
  ])
  // expect(RendererProcess.invoke).toHaveBeenCalledWith(
  //   'Viewlet.send',
  //   'Explorer',
  //   'updateDirents',
  //   [
  //     {
  //       depth: 1,
  //       index: 1,
  //       languageId: 'unknown',
  //       name: 'index.html',
  //       path: '/index.html',
  //       setSize: 3,
  //       type: DirentType.File,
  //     },
  //   ]
  // )
})

test('handleWheel - down - already at bottom', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 44,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 2,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorer.handleWheel(state, 10)).toBe(state)
})

test('handleWheel - down - already at bottom but viewlet is larger than items can fit', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 388,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 18,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorer.handleWheel(state, 100)).toBe(state)
})

test.skip('event - workspace change', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readFiles':
        return {
          source: 'notSupported',
          type: 'none',
          files: [],
        }
      default:
        console.log({ method })
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await GlobalEventBus.emitEvent('workspace.change', '/test')
  expect(RendererProcess.invoke).toBeCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [],
  ])
})

test.skip('newFile - root', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.writeFile':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'handleCreateFileInputBox':
        return 'new file'
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.newFile(state)
  await ViewletExplorer.acceptCreateNewFile(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(3, [
    909090,
    expect.any(Number),
    'Viewlet.send',
    'Explorer',
    'updateDirents',
    [
      {
        depth: 1,
        icon: '',
        name: 'new file',
        path: '/new file',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  ])
})

test.skip('newFile - inside folder', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    focusedIndex: 1,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.writeFile':
        return null
      case 'FileSystem.readDirWithFileTypes':
        return [
          {
            name: 'a.txt',
            type: DirentType.File,
          },
          {
            name: 'b.txt',
            type: DirentType.File,
          },
          {
            name: 'c.txt',
            type: DirentType.File,
          },
        ]
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (params[1]) {
      case 'hideCreateFileInputBox':
        return 'created.txt'
      case 'updateDirents':
      case 'setFocusedIndex':
      case 'showCreateFileInputBox':
        return null
      default:
        console.log({ params })
        throw new Error('unexpected message')
    }
  })

  await ViewletExplorer.newFile(state)
  expect(await ViewletExplorer.acceptCreateNewFile(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-2/a.txt',
        posInSet: 1,
        setSize: 4,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/folder-2/b.txt',
        posInSet: 2,
        setSize: 4,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/test/folder-2/c.txt',
        posInSet: 3,
        setSize: 4,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'created.txt',
        path: '/test/folder-2/created.txt',
        posInSet: 4,
        setSize: 4,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
  })
  // expect(RendererProcess.invoke).toHaveBeenCalledTimes(4)
  // expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
  //   4,
  //   'Viewlet.send',
  //   'Explorer',
  //   'updateDirents',

  // )
})

test.skip('newFile - error with writeFile', async () => {
  const state = ViewletExplorer.create('', '', 0, 0, 0, 0)
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.writeFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method) => {
    switch (method) {
      case 'abc':
        return 'my-file.txt'
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.newFile(state)
  await ViewletExplorer.acceptCreateNewFile(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    'Viewlet.send',
    'Explorer',
    'showCreateFileInputBox',
    0,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    'Viewlet.send',
    'Explorer',
    'hideCreateFileInputBox',
    0,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(3, [
    909090,
    expect.any(Number),
    'Dialog.showErrorDialogWithOptions',
    {
      category: undefined,
      codeFrame: undefined,
      message: 'TypeError: x is not a function',
      stack: undefined,
      stderr: undefined,
    },
    ['Show Command Output', 'Cancel', 'Open Git Log'],
  ])
})

test('newFile - canceled', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  FileSystem.writeFile.mockImplementation(() => {})
  expect(await ViewletExplorer.newFile(state)).toMatchObject({
    editingIndex: 0,
  })
})

test.skip('newFile - race condition', () => {
  // TODO test what happens when first loadContent promise returns last
})

test('removeDirent - first', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2, // TODO should be 1
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3, // TODO should be 2
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
    ],
    focusedIndex: 0,
  })
})

test('removeDirent - only folder', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    items: [],
    focusedIndex: -1,
  })
})

test('removeDirent - expanded folder', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    focusedIndex: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-1/a.txt',
        posInSet: 1,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/folder-1/b.txt',
        posInSet: 2,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2, // TODO should be 1
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3, // TODO should be 2
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
    ],
    focusedIndex: 0,
  })
})

test('removeDirent - middle', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    focusedIndex: 1,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3, // TODO should be 2
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
    ],
    focusedIndex: 0,
  })
})

test('removeDirent - last', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    focusedIndex: 2,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3, // TODO should be 2
        type: DirentType.Directory,
      },
    ],
    focusedIndex: 1,
  })
})

test('removeDirent - no dirents left', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: PathSeparatorType.Slash,
    focusedIndex: -1,
    items: [],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    items: [],
  })
})

test('resize - same height', () => {
  const state = {
    ...ViewletExplorer.create(0, '', 0, 0, 20, 20),
    deltaY: 0,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: 'file 1',
        posInSet: 1,
        setSize: 4,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: 'file 2',
        posInSet: 2,
        setSize: 4,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: 'file 3',
        posInSet: 3,
        setSize: 4,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 4',
        path: 'file 4',
        posInSet: 4,
        setSize: 4,
        type: DirentType.File,
      },
    ],
    focusedIndex: 0,
    height: 200,
    hoverIndex: -1,
    left: 0,
    maxLineY: 10,
    minLineY: 0,
    root: '/test',
    top: 0,
  }
  const newState = ViewletExplorer.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 60,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
    })
  )
})

test('computeRenamedDirents - file', () => {
  expect(
    ViewletExplorer.computeRenamedDirent(
      [
        {
          depth: 1,
          icon: '',
          name: 'file 1',
          path: '/test/file 1',
          posInSet: 1,
          setSize: 1,
          type: DirentType.File,
        },
      ],
      0,
      'file 2'
    )
  ).toEqual({
    focusedIndex: 0,
    newDirents: [
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: '/test/file 2',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

test('computeRenamedDirents - file moves to the top', () => {
  expect(
    ViewletExplorer.computeRenamedDirent(
      [
        {
          depth: 1,
          icon: '',
          name: 'b',
          path: '/test/b',
          posInSet: 1,
          setSize: 3,
          type: DirentType.File,
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 2,
          setSize: 3,
          type: DirentType.File,
        },
        {
          depth: 1,
          icon: '',
          name: 'd',
          path: '/test/d',
          posInSet: 3,
          setSize: 3,
          type: DirentType.File,
        },
      ],
      2,
      'a'
    )
  ).toEqual({
    focusedIndex: 0,
    newDirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
  })
})

test('computeRenamedDirents - file moves to the top - open directories are in between', () => {
  expect(
    ViewletExplorer.computeRenamedDirent(
      [
        {
          depth: 1,
          icon: '',
          name: 'b',
          path: '/test/b',
          posInSet: 1,
          setSize: 3,
          type: DirentType.DirectoryExpanded,
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/b/a',
          posInSet: 1,
          setSize: 1,
          type: DirentType.File,
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 2,
          setSize: 3,
          type: DirentType.DirectoryExpanded,
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/c/a',
          posInSet: 1,
          setSize: 1,
          type: DirentType.File,
        },
        {
          depth: 1,
          icon: '',
          name: 'd',
          path: '/test/d',
          posInSet: 3,
          setSize: 3,
          type: DirentType.File,
        },
      ],
      4,
      'a'
    )
  ).toEqual({
    focusedIndex: 0,
    newDirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
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
        name: 'a',
        path: '/test/b/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/c/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

test('computeRenamedDirents - file moves to the bottom', () => {
  expect(
    ViewletExplorer.computeRenamedDirent(
      [
        {
          depth: 1,
          icon: '',
          name: 'a',
          path: '/test/a',
          posInSet: 1,
          setSize: 3,
          type: DirentType.File,
        },
        {
          depth: 1,
          icon: '',
          name: 'b',
          path: '/test/b',
          posInSet: 2,
          setSize: 3,
          type: DirentType.File,
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 3,
          setSize: 3,
          type: DirentType.File,
        },
      ],
      0,
      'd'
    )
  ).toEqual({
    focusedIndex: 2,
    newDirents: [
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
  })
})

test('computeRenamedDirents - file moves to the bottom - open directories are in between', () => {
  expect(
    ViewletExplorer.computeRenamedDirent(
      [
        {
          depth: 1,
          icon: '',
          name: 'a',
          path: '/test/a',
          posInSet: 1,
          setSize: 3,
          type: DirentType.File,
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
          name: 'a',
          path: '/test/b/a',
          posInSet: 1,
          setSize: 1,
          type: DirentType.File,
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 3,
          setSize: 3,
          type: DirentType.DirectoryExpanded,
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/c/a',
          posInSet: 1,
          setSize: 1,
          type: DirentType.File,
        },
      ],
      0,
      'd'
    )
  ).toEqual({
    focusedIndex: 4,
    newDirents: [
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 1,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/b/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 2,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/c/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
  })
})

test('computeRenamedDirents - directory', () => {
  expect(
    ViewletExplorer.computeRenamedDirent(
      [
        {
          depth: 1,
          icon: '',
          name: 'folder-1',
          path: '/test/folder-1',
          posInSet: 1,
          setSize: 1,
          type: DirentType.File,
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/folder-1/a',
          posInSet: 1,
          setSize: 2,
          type: DirentType.File,
        },
        {
          depth: 2,
          icon: '',
          name: 'b',
          path: '/test/folder-1/b',
          posInSet: 2,
          setSize: 2,
          type: DirentType.File,
        },
      ],
      0,
      'folder-2'
    )
  ).toEqual({
    focusedIndex: 0,
    newDirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/folder-2/a',
        posInSet: 1,
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b',
        path: '/test/folder-2/b',
        posInSet: 2,
        setSize: 2,
        type: DirentType.File,
      },
    ],
  })
})

// TODO test out of order responses
// TODO test error
// TODO test when parent folder collapses
// TODO test when one of the folders is removed during expansion

test('expandAll', async () => {
  const state = {
    ...ViewletExplorer.create(),
    path: '/test',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        type: DirentType.Directory,
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        type: DirentType.Directory,
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        type: DirentType.Directory,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((path) => {
    switch (path) {
      case '/folder-1':
      case '/folder-2':
      case '/folder-3':
        return [
          { name: 'a.txt', type: DirentType.File },
          { name: 'b.txt', type: DirentType.File },
          { name: 'c.txt', type: DirentType.File },
        ]
      default:
        throw new Error('unexpected folder')
    }
  })
  expect(await ViewletExplorer.expandAll(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-1/a.txt',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-1/b.txt',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-1/c.txt',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-2/a.txt',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-2/b.txt',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-2/c.txt',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-3/a.txt',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-3/b.txt',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-3/c.txt',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
  })
})

test('collapseAll', () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 4,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-1/a.txt',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-1/b.txt',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-1/c.txt',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 4,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-2/a.txt',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-2/b.txt',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-2/c.txt',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 4,
        type: DirentType.DirectoryExpanded,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-3/a.txt',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-3/b.txt',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-3/c.txt',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 4,
        setSize: 4,
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorer.collapseAll(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 4,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 4,
        setSize: 4,
        type: DirentType.File,
      },
    ],
  })
})

test('event - workspace change', async () => {
  const state = {
    ...ViewletExplorer.create(),
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'file 1',
        type: DirentType.File,
      },
      {
        name: 'file 2',
        type: DirentType.File,
      },
      {
        name: 'file 3',
        type: DirentType.File,
      },
    ]
  })

  Workspace.state.workspacePath = '/test'
  const newState = await ViewletExplorer.handleWorkspaceChange(state)
  expect(newState).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: '/test/file 1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: '/test/file 2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: '/test/file 3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.File,
      },
    ],
  })
})

test('openContainingFolder', async () => {
  const state1 = {
    ...ViewletExplorer.create('', 0, 0, 0, 0),
    root: '/test',
  }

  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'OpenNativeFolder.openNativeFolder':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.openContainingFolder(state1)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'OpenNativeFolder.openNativeFolder',
    '/test'
  )
})

test('openContainingFolder - nested', async () => {
  const state1 = {
    ...ViewletExplorer.create('', 0, 0, 0, 0),
    root: '/test',
    focusedIndex: 1,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }

  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'OpenNativeFolder.openNativeFolder':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.openContainingFolder(state1)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'OpenNativeFolder.openNativeFolder',
    '/test/a'
  )
})

test.skip('revealItem - error - not found', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    items: [],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    throw new Error('File not found: /test/index.js')
  })
  await expect(
    ViewletExplorer.revealItem(state, '/test/index.js')
  ).rejects.toThrowError('File not found: /test/index.js')
})

test('revealItem - two levels deep', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [{ name: 'a', type: DirentType.Directory }]
      case '/test/a':
        return [{ name: 'b.txt', type: DirentType.File }]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/a/b.txt')
  ).toMatchObject({
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    focused: true,
    focusedIndex: 1,
  })
})

test('revealItem - three levels deep', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [{ name: 'a', type: DirentType.Directory }]
      case '/test/a':
        return [{ name: 'b', type: DirentType.Directory }]
      case '/test/a/b':
        return [{ name: 'c', type: DirentType.Directory }]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  expect(await ViewletExplorer.revealItem(state, '/test/a/b/c')).toMatchObject({
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
      {
        depth: 2,
        icon: '',
        name: 'b',
        path: '/test/a/b',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 3,
        icon: '',
        name: 'c',
        path: '/test/a/b/c',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
    ],
    focused: true,
    focusedIndex: 2,
  })
})

test('revealItem - insert into existing tree', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
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
            depth: 1,
            icon: '',
            name: 'folder-1',
            path: '/test/folder-1',
            posInSet: 1,
            setSize: 3,
            type: DirentType.Directory,
          },
          {
            depth: 1,
            icon: '',
            name: 'folder-2',
            path: '/test/folder-2',
            posInSet: 2,
            setSize: 3,
            type: DirentType.Directory,
          },
          {
            depth: 1,
            icon: '',
            name: 'folder-3',
            path: '/test/folder-3',
            posInSet: 3,
            setSize: 3,
            type: DirentType.Directory,
          },
        ]
      case '/test/folder-1':
        return [{ name: 'a.txt', type: DirentType.File }]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/folder-1/a.txt')
  ).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-1/a.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: DirentType.Directory,
      },
    ],
    focused: true,
    focusedIndex: 1,
  })
})

test("revealItem - insert into existing tree - some sibling nodes don't exist anymore", async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: DirentType.Directory,
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
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
            depth: 1,
            icon: '',
            name: 'folder-1',
            path: '/test/folder-1',
            posInSet: 1,
            setSize: 1,
            type: DirentType.Directory,
          },
        ]
      case '/test/folder-1':
        return [{ name: 'a.txt', type: DirentType.File }]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/folder-1/a.txt')
  ).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-1/a.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    focused: true,
    focusedIndex: 1,
  })
})

test('revealItem - already visible', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 20,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    throw new Error(`file not found ${uri}`)
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/a/b.txt')
  ).toMatchObject({
    focused: true,
    focusedIndex: 1,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

test('revealItem - scroll down', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 1,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    throw new Error(`file not found ${uri}`)
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/a/b.txt')
  ).toMatchObject({
    focused: true,
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

test('revealItem - scroll up', async () => {
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    throw new Error(`file not found ${uri}`)
  })
  expect(await ViewletExplorer.revealItem(state, '/test/a')).toMatchObject({
    focused: true,
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 1,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

test('acceptEdit - rename', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a.txt',
        path: '/test/a.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
  }
  expect(await ViewletExplorer.acceptEdit(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'b.txt',
        path: '/test/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
  expect(FileSystem.rename).toHaveBeenCalledTimes(1)
  expect(FileSystem.rename).toHaveBeenCalledWith('/test/a.txt', '/test/b.txt')
})

test('acceptEdit - rename - nested file', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
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
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    editingIndex: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'c.txt',
  }
  expect(await ViewletExplorer.acceptEdit(state)).toMatchObject({
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
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/test/a/c.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
})

// TODO add more tests for
// - opening symlink file
// - symlink stat error
// - symlink target is unsupported type
// - clicking on symlink
// - expanding symlink folder
test('handleArrowRight - symlink - error', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    items: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        name: 'index.css',
        path: '/index.css',
        type: DirentType.Symlink,
      },
    ],
  }
  // @ts-ignore
  FileSystem.getRealPath.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ViewletExplorer.handleArrowRight(state)).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('handleClickCurrent', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 2,
        languageId: 'unknown',
        name: 'index.js',
        path: '/index.js',
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  expect(await ViewletExplorer.handleClickCurrent(state)).toMatchObject({
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
  })
})

test('copyPath - when scrolled down', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    minLineY: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    maxLineY: 2,
    items: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: DirentType.File,
      },
    ],
  }
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  await ViewletExplorer.copyPath(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'ClipBoard.writeText',
    '/index.html'
  )
})
