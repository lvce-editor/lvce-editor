import { jest } from '@jest/globals'
import { CancelationError } from '../src/parts/Errors/CancelationError.js'

beforeEach(() => {
  jest.resetAllMocks()
  GlobalEventBus.state.listenerMap = Object.create(null)
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

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
    getPathSeparator: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

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

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletExplorer, oldState, newState)
}

test('name', () => {
  expect(ViewletExplorer.name).toBe('Explorer')
})

test('create', () => {
  const state = ViewletExplorer.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'file 1',
        type: 'file',
      },
      {
        name: 'file 2',
        type: 'file',
      },
      {
        name: 'file 3',
        type: 'file',
      },
    ]
  })
  // @ts-ignore
  FileSystem.getPathSeparator.mockImplementation(() => {
    return '/'
  })
  expect(await ViewletExplorer.loadContent(state)).toEqual({
    deltaY: 0,
    version: 0,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: '/test/file 1',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: '/test/file 2',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: '/test/file 3',
        posInSet: 3,
        setSize: 3,
        type: 'file',
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
    pathSeparator: '/',
    editingIndex: -1,
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
            type: 'file',
          },
          {
            name: 'file 2',
            type: 'file',
          },
          {
            name: 'file 3',
            type: 'file',
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
            type: 'file',
          },
          {
            name: 'file 2',
            type: 'file',
          },
          {
            name: 'file 3',
            type: 'file',
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
              type: 'file',
            },
          ]
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1))
          return [
            {
              name: 'file 1',
              type: 'file',
            },
            {
              name: 'file 2',
              type: 'file',
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
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: '/test/file 2',
        posInSet: 2,
        setSize: 2,
        type: 'file',
      },
    ]
  )
})

test('loadContent - error - typeError', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.getPathSeparator.mockImplementation(() => {
    return '/'
  })
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
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    throw new SyntaxError('unexpected token x')
  })
  // @ts-ignore
  FileSystem.getPathSeparator.mockImplementation(() => {
    return '/'
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new SyntaxError('unexpected token x')
  )
})

test('loadContent - error - command not found', async () => {
  const state = ViewletExplorer.create()
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    throw new Error('command -1 not found')
  })
  // @ts-ignore
  FileSystem.getPathSeparator.mockImplementation(() => {
    return '/'
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
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: 'file 1',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: 'file 2',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: 'file 3',
        posInSet: 3,
        setSize: 3,
        type: 'file',
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
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: 'file 2',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: 'file 3',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
    ]
  )
})

test.skip('handleContextMenu', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {})
  const state = ViewletExplorer.create()
  await ViewletExplorer.handleContextMenu(state, 0, 0, -1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(null)
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
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
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
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
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
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/index.css')
})

test('handleClick - file - error', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
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
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/index.css')
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
    pathSeparator: '/',
    dirents: [
      {
        name: 'folder-1',
        type: 'folder',
        path: '/folder-1',
        setSize: 3,
        posInSet: 1,
        depth: 1,
      },
      {
        name: 'folder-2',
        type: 'folder',
        path: '/folder-2',
        setSize: 3,
        posInSet: 2,
        depth: 1,
      },
      {
        name: 'folder-3',
        type: 'folder',
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
    return [{ name: 'index.js', type: 'file' }]
  })
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1/index.js',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'folder',
      },
      {
        depth: 1,
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'folder',
      },
    ],
  })
})

test('handleClick - directory-expanded - error', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
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
        throw new Error('unexpected message')
    }
  })
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    focusedIndex: 0,
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Main.openUri', '/index.css')
})

test.skip('handleClick - directory-expanded - scrolled down', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'folder-1',
        type: 'folder',
        path: '/folder-1',
        setSize: 2,
        posInSet: 1,
        depth: 1,
      },
      {
        name: 'folder-2',
        type: 'directory-expanded',
        path: '/folder-2',
        setSize: 2,
        posInSet: 2,
        depth: 1,
      },
      {
        name: 'a.txt',
        type: 'file',
        path: '/folder-2/a.txt',
        setSize: 2,
        posInSet: 1,
        depth: 2,
      },
      {
        name: 'b.txt',
        type: 'file',
        path: '/folder-2/b.txt',
        setSize: 2,
        posInSet: 2,
        depth: 2,
      },
    ],
    minLineY: 1,
  }
  expect(await ViewletExplorer.handleClick(state, 0)).toMatchObject({
    dirents: [
      {
        depth: 1,
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 2,
        type: 'directory',
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
    pathSeparator: '/',
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory',
      },
    ],
  }
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    return state
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [{ name: 'index.js', type: 'file' }]
  })
  expect(await ViewletExplorer.handleClick(state, 2)).toMatchObject({
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        icon: '',
        name: 'index.js',
        path: '/test-folder/index.js',
        type: 'file',
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
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 1,
        icon: '',
        name: 'parent-directory',
        path: '/parent-directory',
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 2,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        type: 'directory',
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 2,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        type: 'directory',
      },
    ],
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [{ name: 'index.js', type: 'file' }]
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
        type: 'directory',
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
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        type: 'directory',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        type: 'directory',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        type: 'directory',
      },
    ],
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readDirWithFileTypes':
        return [{ name: 'index.js', type: 'file' }]
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
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1,index.js', // TODO
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory-expanded',
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
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1,index.js', // TODO
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-2,index.js', // TODO
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory-expanded',
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
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-1,index.js',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-2,index.js',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'index.js',
        path: '/folder-3,index.js',
        posInSet: 1,
        setSize: 1,
        type: 'file',
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
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        languageId: 'unknown',
        name: 'index.js',
        path: '/test-folder/index.js',
        type: 'file',
      },
    ],
  }
  expect(await ViewletExplorer.handleClick(state, 2)).toMatchObject({
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory',
        icon: '',
      },
    ],
  })
})

test('focusPrevious', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
        path: '/test-folder',
      },
    ],
  }
  expect(ViewletExplorer.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
        path: '/test-folder',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.focusPrevious(state)
  expect(state.focusedIndex).toBe(0)
})

test('focusPrevious - when no focus', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
        path: '/test-folder',
      },
    ],
  }
  expect(ViewletExplorer.focusPrevious(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious - when no focus and no dirents', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.focusPrevious(state)
  expect(state.focusedIndex).toBe(-1)
})

test('focusNext', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
        path: '/test-folder',
      },
    ],
  }
  expect(ViewletExplorer.focusNext(state)).toMatchObject({ focusedIndex: 1 })
})

test('focusNext - at end', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
        path: '/test-folder',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.focusNext(state)
  expect(state.focusedIndex).toBe(2)
})

test('focusNext - when no focus', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: 'file',
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: 'file',
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: 'directory',
        path: '/test-folder',
      },
    ],
  }
  expect(ViewletExplorer.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('handleArrowLeft - root file', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: 'file',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('handleArrowLeft - collapsed root folder', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('handleArrowLeft - expanded root folder with nested child folders inside', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 4,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 4,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 4,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 2,
        name: 'a',
        path: '/test-folder/a',
        type: 'directory-expanded',
      },
      {
        depth: 3,
        posInSet: 1,
        setSize: 2,
        name: 'a',
        path: '/test-folder/a/b',
        type: 'directory-expanded',
      },
      {
        depth: 3,
        posInSet: 2,
        setSize: 2,
        name: 'c.html',
        path: '/test-folder/a/c.html',
        type: 'file',
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 2,
        name: 'd.html',
        path: '/test-folder/d.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 4,
        setSize: 4,
        name: 'other-file.html',
        path: '/other-file.html',
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.handleArrowLeft(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 4,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 4,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 4,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory',
        icon: '',
      },
      {
        depth: 1,
        posInSet: 4,
        setSize: 4,
        name: 'other-file.html',
        path: '/other-file.html',
        type: 'file',
      },
    ],
  })
})

test('handleArrowLeft - nested file - first child', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 3,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.handleArrowLeft(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('handleArrowLeft - nested file - third child', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 6,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 4,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 4,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        name: 'test-folder',
        path: '/test-folder',
        setSize: 4,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 3,
        name: 'a.html',
        path: '/test-folder/a.html',
        type: 'file',
      },
      {
        depth: 2,
        posInSet: 2,
        setSize: 3,
        name: 'folder-b',
        path: '/test-folder/folder-b',
        type: 'file',
      },
      {
        depth: 3,
        posInSet: 1,
        setSize: 1,
        name: 'file-b-1.html',
        path: '/test-folder/folder-b/file-b-1.html',
        type: 'file',
      },
      {
        depth: 2,
        posInSet: 3,
        setSize: 3,
        name: 'c.html',
        path: '/test-folder/c.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 4,
        setSize: 4,
        name: 'other-file.html',
        path: '/other-file.html',
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.handleArrowLeft(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('handleArrowLeft - when no focus', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('handleArrowRight - file', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: 'file',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.handleArrowRight(state)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
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
    pathSeparator: '/',
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
        icon: '',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
        icon: '',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory',
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
    return [{ name: 'index.js', type: 'file' }]
  })
  expect(await ViewletExplorer.handleArrowRight(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
        icon: '',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
        icon: '',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
        icon: '',
      },
      {
        depth: 2,
        posInSet: 1,
        setSize: 1,
        name: 'index.js',
        path: '/test-folder/index.js',
        type: 'file',
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
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory',
      },
    ],
    pathSeparator: '/',
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
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        name: 'index.css',
        path: '/index.css',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        name: 'index.html',
        path: '/index.html',
        type: 'file',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        name: 'test-folder',
        path: '/test-folder',
        type: 'directory-expanded',
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
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 2,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        index: 0,
        languageId: 'unknown',
        name: 'index.js',
        path: '/test-folder/index.js',
        setSize: 1,
        type: 'file',
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
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 2,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        setSize: 3,
        type: 'directory-expanded',
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
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 2,
        languageId: 'unknown',
        name: 'test-folder',
        path: '/test-folder',
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        index: 0,
        languageId: 'unknown',
        name: 'index.js',
        path: '/test-folder/index.js',
        setSize: 1,
        type: 'file',
      },
    ],
  }
  expect(await ViewletExplorer.handleArrowRight(state)).toBe(state)
})

test('focusFirst', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusFirst - no dirents', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [],
  }
  expect(ViewletExplorer.focusFirst(state)).toBe(state)
})

test('focusFirst - focus already at first', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.focusFirst(state)).toBe(state)
})

test('focusLast', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no dirents', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    dirents: [],
  }
  expect(ViewletExplorer.focusLast(state)).toMatchObject({
    focusedIndex: -1,
  })
})

test('focusLast - focus already at last', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.focusLast(state)).toBe(state)
})

test('handleWheel - up', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 22,
    deltaY: 22,
    minLineY: 0,
    maxLineY: 2,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
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
          type: 'file',
        },
      ],
    ],
    ['Viewlet.send', 'Explorer', 'setFocusedIndex', -2, -2],
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
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
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
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
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
          type: 'file',
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
  //       type: 'file',
  //     },
  //   ]
  // )
})

test('handleWheel - down - already at bottom', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 44,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 2,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.handleWheel(state, 10)).toBe(state)
})

test('handleWheel - down - already at bottom but viewlet is larger than items can fit', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 388,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 18,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 3,
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.handleWheel(state, 100)).toBe(state)
})

test('handlePaste - copied gnome files', async () => {
  const state1 = {
    ...ViewletExplorer.create('', 0, 0, 0, 0),
    root: '/test',
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
      case 2:
      case 3:
        return state1
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'some-file.txt',
        type: 'file',
      },
    ]
  })
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {})
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readNativeFiles':
        return {
          source: 'gnomeCopiedFiles',
          type: 'copy',
          files: ['/test/some-file.txt'],
        }
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  expect(await ViewletExplorer.handlePaste(state1)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'some-file.txt',
        path: '/testsome-file.txt',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
    ],
  })
})

test('handlePaste - cut gnome files', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readNativeFiles':
        return {
          source: 'gnomeCopiedFiles',
          type: 'cut',
          files: ['/test/some-file.txt'],
        }
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.handlePaste(state)
})

test('handlePaste - not supported', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readNativeFiles':
        return {
          source: 'notSupported',
          type: 'none',
          files: [],
        }
      default:
        throw new Error(`unexpected message ${method}`)
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const spy = jest.spyOn(console, 'info').mockImplementation(() => {})
  await ViewletExplorer.handlePaste(state)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    '[ViewletExplorer/handlePaste] no paths detected'
  )
})

test('handlePaste - unexpected result', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Command.execute.mockImplementation(() => {
    throw new Error('unexpected native paste type: non-existing')
  })
  await expect(ViewletExplorer.handlePaste(state)).rejects.toThrowError(
    new Error('unexpected native paste type: non-existing')
  )
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
    pathSeparator: '/',
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
  await ViewletExplorer.acceptNewFile(state)
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
        type: 'file',
      },
    ],
  ])
})

test.skip('newFile - inside folder', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 1,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
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
            type: 'file',
          },
          {
            name: 'b.txt',
            type: 'file',
          },
          {
            name: 'c.txt',
            type: 'file',
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
  expect(await ViewletExplorer.acceptNewFile(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-2/a.txt',
        posInSet: 1,
        setSize: 4,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/folder-2/b.txt',
        posInSet: 2,
        setSize: 4,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/test/folder-2/c.txt',
        posInSet: 3,
        setSize: 4,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'created.txt',
        path: '/test/folder-2/created.txt',
        posInSet: 4,
        setSize: 4,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
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
  await ViewletExplorer.acceptNewFile(state)
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
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletExplorer.newFile(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Explorer',
    'showCreateFileInputBox',
    0
  )
})

test.skip('newFile - race condition', () => {
  // TODO test what happens when first loadContent promise returns last
})

test('removeDirent - first', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 0,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (params[1]) {
      case 'hideCreateFileInputBox':
        return 'created.txt'
      case 'updateDirents':
      case 'setFocusedIndex':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2, // TODO should be 1
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3, // TODO should be 2
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
    ],
    focusedIndex: 0,
  })
})

test('removeDirent - only folder', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 0,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 1,
        type: 'directory',
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (params[1]) {
      case 'hideCreateFileInputBox':
        return 'created.txt'
      case 'updateDirents':
      case 'setFocusedIndex':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    dirents: [],
    focusedIndex: -1,
  })
})

test('removeDirent - expanded folder', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 0,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-1/a.txt',
        posInSet: 1,
        setSize: 2,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/folder-1/b.txt',
        posInSet: 2,
        setSize: 2,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (params[1]) {
      case 'hideCreateFileInputBox':
        return 'created.txt'
      case 'updateDirents':
      case 'setFocusedIndex':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2, // TODO should be 1
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3, // TODO should be 2
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
    ],
    focusedIndex: 0,
  })
})

test('removeDirent - middle', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 1,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (params[1]) {
      case 'hideCreateFileInputBox':
        return 'created.txt'
      case 'updateDirents':
      case 'setFocusedIndex':
        return null
      default:
        console.log({ method, params })
        throw new Error('unexpected message')
    }
  })
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3, // TODO should be 2
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
    ],
    focusedIndex: 0,
  })
})

test('removeDirent - last', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 2,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (params[1]) {
      case 'hideCreateFileInputBox':
        return 'created.txt'
      case 'updateDirents':
      case 'setFocusedIndex':
        return null
      default:
        console.log({ method, params })
        throw new Error('unexpected message')
    }
  })
  expect(await ViewletExplorer.removeDirent(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3, // TODO should be 2
        type: 'directory',
      },
    ],
    focusedIndex: 1,
  })
})

test('removeDirent - no dirents left', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: -1,
    dirents: [],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  // @ts-ignore
  FileSystem.remove.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'hideCreateFileInputBox':
        return 'created.txt'
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.removeDirent(state)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test('resize - same height', () => {
  const state = {
    ...ViewletExplorer.create(0, '', 0, 0, 20, 20),
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: 'file 1',
        posInSet: 1,
        setSize: 4,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: 'file 2',
        posInSet: 2,
        setSize: 4,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: 'file 3',
        posInSet: 3,
        setSize: 4,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 4',
        path: 'file 4',
        posInSet: 4,
        setSize: 4,
        type: 'file',
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
          type: 'file',
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
        type: 'file',
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
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 2,
          setSize: 3,
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'd',
          path: '/test/d',
          posInSet: 3,
          setSize: 3,
          type: 'file',
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
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 3,
        type: 'file',
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
          type: 'directory-expanded',
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/b/a',
          posInSet: 1,
          setSize: 1,
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 2,
          setSize: 3,
          type: 'directory-expanded',
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/c/a',
          posInSet: 1,
          setSize: 1,
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'd',
          path: '/test/d',
          posInSet: 3,
          setSize: 3,
          type: 'file',
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
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'b',
        path: '/test/b',
        posInSet: 2,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/b/a',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 3,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/c/a',
        posInSet: 1,
        setSize: 1,
        type: 'file',
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
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'b',
          path: '/test/b',
          posInSet: 2,
          setSize: 3,
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 3,
          setSize: 3,
          type: 'file',
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
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3,
        setSize: 3,
        type: 'file',
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
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'b',
          path: '/test/b',
          posInSet: 2,
          setSize: 3,
          type: 'directory-expanded',
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/b/a',
          posInSet: 1,
          setSize: 1,
          type: 'file',
        },
        {
          depth: 1,
          icon: '',
          name: 'c',
          path: '/test/c',
          posInSet: 3,
          setSize: 3,
          type: 'directory-expanded',
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/c/a',
          posInSet: 1,
          setSize: 1,
          type: 'file',
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
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/b/a',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'c',
        path: '/test/c',
        posInSet: 2,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/c/a',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'd',
        path: '/test/d',
        posInSet: 3,
        setSize: 3,
        type: 'file',
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
          type: 'file',
        },
        {
          depth: 2,
          icon: '',
          name: 'a',
          path: '/test/folder-1/a',
          posInSet: 1,
          setSize: 2,
          type: 'file',
        },
        {
          depth: 2,
          icon: '',
          name: 'b',
          path: '/test/folder-1/b',
          posInSet: 2,
          setSize: 2,
          type: 'file',
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
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'a',
        path: '/test/folder-2/a',
        posInSet: 1,
        setSize: 2,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b',
        path: '/test/folder-2/b',
        posInSet: 2,
        setSize: 2,
        type: 'file',
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
    pathSeparator: '/',
    dirents: [
      {
        depth: 1,
        posInSet: 1,
        setSize: 3,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        type: 'directory',
      },
      {
        depth: 1,
        posInSet: 2,
        setSize: 3,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        type: 'directory',
      },
      {
        depth: 1,
        posInSet: 3,
        setSize: 3,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        type: 'directory',
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
          { name: 'a.txt', type: 'file' },
          { name: 'b.txt', type: 'file' },
          { name: 'c.txt', type: 'file' },
        ]
      default:
        throw new Error('unexpected folder')
    }
  })
  expect(await ViewletExplorer.expandAll(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-1/a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-1/b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-1/c.txt',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-2/a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-2/b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-2/c.txt',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-3/a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-3/b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-3/c.txt',
        posInSet: 3,
        setSize: 3,
        type: 'file',
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
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 4,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-1/a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-1/b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-1/c.txt',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 4,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-2/a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-2/b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-2/c.txt',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 4,
        type: 'directory-expanded',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/folder-3/a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-3/b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-3/c.txt',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 4,
        setSize: 4,
        type: 'file',
      },
    ],
  }
  expect(ViewletExplorer.collapseAll(state)).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/folder-1',
        posInSet: 1,
        setSize: 4,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/folder-2',
        posInSet: 2,
        setSize: 4,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/folder-3',
        posInSet: 3,
        setSize: 4,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 4,
        setSize: 4,
        type: 'file',
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
        type: 'file',
      },
      {
        name: 'file 2',
        type: 'file',
      },
      {
        name: 'file 3',
        type: 'file',
      },
    ]
  })
  // @ts-ignore
  FileSystem.getPathSeparator.mockImplementation(() => {
    return '/'
  })
  Workspace.state.workspacePath = '/test'
  const newState = await ViewletExplorer.handleWorkspaceChange(state)
  expect(newState).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'file 1',
        path: '/test/file 1',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 2',
        path: '/test/file 2',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'file 3',
        path: '/test/file 3',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
    ],
  })
})

test('updateRoot - already disposed', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
    disposed: true,
  }
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    return state1
  })

  expect(await ViewletExplorer.updateRoot()).toBe(state1)
})

test('updateRoot - disposed after reading files', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
  }
  const state2 = {
    ...state1,
    disposed: true,
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
        return state1
      case 2:
        return state2
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  expect(await ViewletExplorer.updateRoot()).toBe(state2)
})

test('updateRoot - root changes while reading directories', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
    root: '/test-1',
  }
  const state2 = {
    ...state1,
    root: '/test-2',
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
        return state1
      case 2:
        return state2
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'folder-1',
        type: 'directory',
      },
    ]
  })
  expect(await ViewletExplorer.updateRoot()).toBe(state2)
})

test('updateRoot - new folder', async () => {
  const state1 = {
    ...ViewletExplorer.create(),
    root: '/test',
  }
  const state2 = {
    ...state1,
  }
  let i = 0
  // @ts-ignore
  Viewlet.getState.mockImplementation(() => {
    switch (++i) {
      case 1:
        return state1
      case 2:
        return state2
      default:
        throw new Error(`unexpected state ${i}`)
    }
  })
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation(() => {
    return [
      {
        name: 'folder-1',
        type: 'directory',
      },
    ]
  })
  expect(await ViewletExplorer.updateRoot()).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/testfolder-1', // TODO missing path separator here
        posInSet: 1,
        setSize: 1,
        type: 'directory',
      },
    ],
  })
})

test('event - issue with blur event after context menu event', async () => {
  const state = {
    ...ViewletExplorer.create('', '/test', 0, 0, 0, 0),
    pathSeparator: '/',
    focusedIndex: 2,
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
      },
    ],
    width: 600,
    height: 600,
    minLineY: 0,
    maxLineY: 100,
  }
  const state2 = await ViewletExplorer.handleContextMenu(state, 0, 0, 0)
  const state3 = await ViewletExplorer.handleBlur(state2)
  expect(state3).toMatchObject({ focusedIndex: 0, focused: false })
})

test('openContainingFolder', async () => {
  const state1 = {
    ...ViewletExplorer.create('', 0, 0, 0, 0),
    root: '/test',
  }

  // @ts-ignore
  Command.execute.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Open.openNativeFolder':
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.openContainingFolder(state1)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('Open.openNativeFolder', '/test')
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
    dirents: [],
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
    pathSeparator: '/',
    dirents: [],
  }
  // @ts-ignore
  FileSystem.readDirWithFileTypes.mockImplementation((uri) => {
    switch (uri) {
      case '/test':
        return [{ name: 'a', type: 'folder' }]
      case '/test/a':
        return [{ name: 'b.txt', type: 'file' }]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/a/b.txt')
  ).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: 'folder',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
    ],
    focused: true,
    focusedIndex: 1,
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
    pathSeparator: '/',
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
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
            type: 'directory',
          },
          {
            depth: 1,
            icon: '',
            name: 'folder-2',
            path: '/test/folder-2',
            posInSet: 2,
            setSize: 3,
            type: 'directory',
          },
          {
            depth: 1,
            icon: '',
            name: 'folder-3',
            path: '/test/folder-3',
            posInSet: 3,
            setSize: 3,
            type: 'directory',
          },
        ]
      case '/test/folder-1':
        return [{ name: 'a.txt', type: 'file' }]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/folder-1/a.txt')
  ).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-1/a.txt',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
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
    pathSeparator: '/',
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-2',
        path: '/test/folder-2',
        posInSet: 2,
        setSize: 3,
        type: 'directory',
      },
      {
        depth: 1,
        icon: '',
        name: 'folder-3',
        path: '/test/folder-3',
        posInSet: 3,
        setSize: 3,
        type: 'directory',
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
            type: 'directory',
          },
        ]
      case '/test/folder-1':
        return [{ name: 'a.txt', type: 'file' }]
      default:
        throw new Error(`file not found ${uri}`)
    }
  })
  expect(
    await ViewletExplorer.revealItem(state, '/test/folder-1/a.txt')
  ).toMatchObject({
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'folder-1',
        path: '/test/folder-1',
        posInSet: 1,
        setSize: 1,
        type: 'directory',
      },
      {
        depth: 2,
        icon: '',
        name: 'a.txt',
        path: '/test/folder-1/a.txt',
        posInSet: 1,
        setSize: 1,
        type: 'file',
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
    pathSeparator: '/',
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: 'directory',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: 'file',
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
    dirents: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: 'directory',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: 'file',
      },
    ],
  })
})
