import { jest } from '@jest/globals'
import * as Command from '../src/parts/Command/Command.js'
import * as GlobalEventBus from '../src/parts/GlobalEventBus/GlobalEventBus.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as ViewletExplorer from '../src/parts/Viewlet/ViewletExplorer.js'
import * as Workspace from '../src/parts/Workspace/Workspace.js'

beforeEach(() => {
  GlobalEventBus.state.listenerMap = Object.create(null)
})

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
  RendererProcess.state.send = jest.fn()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [
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
          ],
        })
        break
      case 'FileSystem.getPathSeparator':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: '/',
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
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
    focusedIndex: -2,
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

// TODO race conditions can happen at several locations, find good pattern/architecture
// to avoid race conditions, otherwise might miss some
test('loadContent - race condition', async () => {
  Workspace.state.workspacePath = '/test'
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  let x = 0
  SharedProcess.state.send = jest.fn(async (message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        if (x++ === 0) {
          SharedProcess.state.receive({
            jsonrpc: '2.0',
            id: message.id,
            result: [
              {
                name: 'file 1',
                type: 'file',
              },
            ],
          })
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1))
          SharedProcess.state.receive({
            jsonrpc: '2.0',
            id: message.id,
            result: [
              {
                name: 'file 1',
                type: 'file',
              },
              {
                name: 'file 2',
                type: 'file',
              },
            ],
          })
        }
        break
      case 'FileSystem.getPathSeparator':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: '/',
        })
        break
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
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
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
    ],
  ])
})

test('loadContent - error - typeError', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  RendererProcess.state.send = jest.fn()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      case 'FileSystem.getPathSeparator':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: '/',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('loadContent - error - syntaxError', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/test'
  RendererProcess.state.send = jest.fn()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'SyntaxError: unexpected token x',
          },
        })
        break
      case 'FileSystem.getPathSeparator':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: '/',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new SyntaxError('unexpected token x')
  )
})

test('loadContent - error - command not found', async () => {
  const state = ViewletExplorer.create()
  RendererProcess.state.send = jest.fn()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'Error: command -1 not found',
          },
        })
        break
      case 'FileSystem.getPathSeparator':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: '/',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(ViewletExplorer.loadContent(state)).rejects.toThrowError(
    new Error('command -1 not found')
  )
})

// TODO add test for contentLoaded with windows paths separators ('\')

test('contentLoaded', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
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
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
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
    ],
  ])
})

test.skip('handleContextMenu', async () => {
  RendererProcess.state.send = jest.fn()
  SharedProcess.state.send = jest.fn()
  const state = ViewletExplorer.create()
  await ViewletExplorer.handleContextMenu(state, 0, 0, -1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith(null)
})

// TODO should handle error gracefully
test.skip('refresh - error', async () => {
  const state = ViewletExplorer.create()
  Workspace.state.workspacePath = '/home/test-user/test-path'
  RendererProcess.state.send = jest.fn()
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  await ViewletExplorer.refresh(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    3024,
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await ViewletExplorer.handleClick(state, -1)
  expect(state.focusedIndex).toBe(-1)
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
  // TODO dont assign -> has effect on other tests
  Command.state.commands[97] = jest.fn()
  await ViewletExplorer.handleClick(state, 0)
  expect(state.focusedIndex).toBe(0)
  expect(Command.state.commands[97]).toHaveBeenCalledWith('/index.css')
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
  // TODO dont assign -> has effect on other tests
  Command.state.commands[97] = jest.fn()
  await ViewletExplorer.handleClick(state, 0)
  expect(state.focusedIndex).toBe(0)
  expect(Command.state.commands[97]).toHaveBeenCalledWith('/index.css')
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
  // TODO dont assign -> has effect on other tests
  Command.state.commands[97] = jest.fn()
  await ViewletExplorer.handleClick(state, 0)
  expect(state.focusedIndex).toBe(0)
  expect(Command.state.commands[97]).toHaveBeenCalledWith('/index.css')
})

test('handleClick - directory-expanded - scrolled down', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  await ViewletExplorer.handleClick(state, 0)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
})

test('handleClick - collapsed folder', async () => {
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [{ name: 'index.js', type: 'file' }],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  await ViewletExplorer.handleClick(state, 2)
  expect(state.focusedIndex).toBe(2)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
        path: '/test-folder,index.js', // TODO this is wrong
        type: 'file',
      },
    ],
  ])
})

test('handleClick - race condition - child folder is being expanded and parent folder is being collapsed', async () => {
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [{ name: 'index.js', type: 'file' }],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  const promise1 = ViewletExplorer.handleClick(state, 1)
  const promise2 = ViewletExplorer.handleClick(state, 0)
  await Promise.all([promise1, promise2])
  expect(state.focusedIndex).toBe(0)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
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
    ],
  ])
})
// TODO test expanding folder

test('handleClick - race condition - opening multiple folders at the same time', async () => {
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [{ name: 'index.js', type: 'file' }],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  const promise1 = ViewletExplorer.handleClick(state, 0)
  const promise2 = ViewletExplorer.handleClick(state, 1)
  const promise3 = ViewletExplorer.handleClick(state, 2)
  await Promise.all([promise1, promise2, promise3])
  expect(state.focusedIndex).toBe(2)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(3)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    3024,
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
    ],
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    3024,
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
    ],
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(3, [
    909090,
    expect.any(Number),
    3024,
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
    ],
  ])
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  await ViewletExplorer.handleClick(state, 2)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
})

test('focusPrevious', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
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
  await ViewletExplorer.focusPrevious(state)
  expect(state.focusedIndex).toBe(0)
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusPrevious(state)
  expect(state.focusedIndex).toBe(0)
})

test('focusPrevious - when no focus', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
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
  await ViewletExplorer.focusPrevious(state)
  expect(state.focusedIndex).toBe(2)
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusNext(state)
  expect(state.focusedIndex).toBe(1)
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusNext(state)
  expect(state.focusedIndex).toBe(2)
})

test('focusNext - when no focus', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
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
  await ViewletExplorer.focusNext(state)
  expect(state.focusedIndex).toBe(0)
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    3,
    2,
  ])
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    6,
    2,
  ])
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowLeft(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowRight(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('handleArrowRight - collapsed folder', async () => {
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [{ name: 'index.js', type: 'file' }],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowRight(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
        path: '/test-folder,index.js', // TODO
        type: 'file',
        icon: '',
      },
    ],
  ])
})

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
  }
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          jsonrpc: '2.0',
          id: message.id,
          result: [],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowRight(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
})

test('handleArrowRight - expanded folder', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowRight(state)
  expect(state.focusedIndex).toBe(3)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    2,
    3,
  ])
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowRight(state)
  expect(state.focusedIndex).toBe(2)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleArrowRight(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('focusFirst', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusFirst(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    1,
    0,
  ])
})

test('focusFirst - no dirents', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [],
  }
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusFirst(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('focusFirst - focus already at first', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusFirst(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('focusLast', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusLast(state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    0,
    1,
  ])
})

test('focusLast - no dirents', async () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    dirents: [],
  }
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusLast(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('focusLast - focus already at last', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.focusLast(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('handleWheel - up', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleWheel(state, -22)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
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
  ])
})

test('handleWheel - up - already at top', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleWheel(state, -10)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('handleWheel - down', async () => {
  const state = {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleWheel(state, 22)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
})

test('handleWheel - down - already at bottom', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleWheel(state, 10)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('handleWheel - down - already at bottom but viewlet is larger than items can fit', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handleWheel(state, 100)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test.skip('handlePaste - copied gnome files', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.readFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'FileSystem.copy':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handlePaste(state)
})

test('handlePaste - cut gnome files', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.readFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'gnomeCopiedFiles',
            type: 'cut',
            files: ['/test/some-file.txt'],
          },
        })
        break
      case 'FileSystem.rename':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.handlePaste(state)
})

test('handlePaste - not supported', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.readFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'notSupported',
            type: 'none',
            files: [],
          },
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const spy = jest.spyOn(console, 'info').mockImplementation(() => {})
  await ViewletExplorer.handlePaste(state)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    '[ViewletExplorer/handlePaste] no paths detected'
  )
})

test.skip('event - workspace change', async () => {
  const state = ViewletExplorer.create('', 0, 0, 0, 0)
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.readFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'notSupported',
            type: 'none',
            files: [],
          },
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await GlobalEventBus.emitEvent('workspace.change', '/test')
  expect(RendererProcess.state.send).toBeCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    3024,
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: undefined,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        console.log({ message })
        if (message[4] === 'hideCreateFileInputBox') {
          RendererProcess.state.handleMessage([
            /* Callback.resolve */ 67330,
            /* callbackId */ callbackId,
            /* result */ 'new file',
          ])
          break
        }
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.newFile(state)
  await ViewletExplorer.acceptNewFile(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(3)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(3, [
    909090,
    expect.any(Number),
    3024,
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

test('newFile - inside folder', async () => {
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: undefined,
        })
        break
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [
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
          ],
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        console.log({ message })
        if (message[4] === 'hideCreateFileInputBox') {
          RendererProcess.state.handleMessage([
            /* Callback.resolve */ 67330,
            /* callbackId */ callbackId,
            /* result */ 'created.txt',
          ])
          break
        }
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.newFile(state)
  await ViewletExplorer.acceptNewFile(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(4)
  console.log(state)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(4, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
})

test.skip('newFile - error with writeFile', async () => {
  const state = ViewletExplorer.create('', '', 0, 0, 0, 0)
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ 'my-file.txt',
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.newFile(state)
  await ViewletExplorer.acceptNewFile(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(3)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'showCreateFileInputBox',
    0,
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'hideCreateFileInputBox',
    0,
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(3, [
    909090,
    expect.any(Number),
    7835,
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
  // TODO mock file system instead
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: undefined,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.newFile(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'showCreateFileInputBox',
    -1,
  ])
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.remove':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        console.log({ message })
        if (message[4] === 'hideCreateFileInputBox') {
          RendererProcess.state.handleMessage([
            /* Callback.resolve */ 67330,
            /* callbackId */ callbackId,
            /* result */ 'created.txt',
          ])
          break
        }
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.removeDirent(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2) // TODO should only be 1 for efficiency
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    0,
    0,
  ])
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.remove':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        console.log({ message })
        if (message[4] === 'hideCreateFileInputBox') {
          RendererProcess.state.handleMessage([
            /* Callback.resolve */ 67330,
            /* callbackId */ callbackId,
            /* result */ 'created.txt',
          ])
          break
        }
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.removeDirent(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2) // TODO should only be 1 for efficiency
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    1,
    0,
  ])
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.remove':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        console.log({ message })
        if (message[4] === 'hideCreateFileInputBox') {
          RendererProcess.state.handleMessage([
            /* Callback.resolve */ 67330,
            /* callbackId */ callbackId,
            /* result */ 'created.txt',
          ])
          break
        }
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.removeDirent(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2) // TODO should only be 1 for efficiency
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'setFocusedIndex',
    2,
    1,
  ])
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.remove':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        console.log({ message })
        if (message[4] === 'hideCreateFileInputBox') {
          RendererProcess.state.handleMessage([
            /* Callback.resolve */ 67330,
            /* callbackId */ callbackId,
            /* result */ 'created.txt',
          ])
          break
        }
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await ViewletExplorer.removeDirent(state)
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
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
  const { newState, commands } = ViewletExplorer.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 60,
  })
  console.log({ newState })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
    })
  )
  expect(commands).toEqual([
    [
      3024,
      'Explorer',
      'updateDirents',
      [
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
      ],
    ],
  ])
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
    path: '/test',
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        const path = message.params[0]
        switch (path) {
          case '/folder-1':
          case '/folder-2':
          case '/folder-3':
            SharedProcess.state.receive({
              jsonrpc: '2.0',
              id: message.id,
              result: [
                { name: 'a.txt', type: 'file' },
                { name: 'b.txt', type: 'file' },
                { name: 'c.txt', type: 'file' },
              ],
            })
            break
          default:
            throw new Error('unexpected folder')
        }

        break
      default:
        throw new Error('unexpected message')
    }
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  await ViewletExplorer.expandAll(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
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
        name: 'a.txt',
        path: '/folder-1,a.txt', // TODO path separator is wrong
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-1,b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-1,c.txt',
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
        path: '/folder-2,a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-2,b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-2,c.txt',
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
        path: '/folder-3,a.txt',
        posInSet: 1,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/folder-3,b.txt',
        posInSet: 2,
        setSize: 3,
        type: 'file',
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/folder-3,c.txt',
        posInSet: 3,
        setSize: 3,
        type: 'file',
      },
    ],
  ])
})

test('collapseAll', async () => {
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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log({ message })
        throw new Error('unexpected message (3)')
    }
  })
  await ViewletExplorer.collapseAll(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'Explorer',
    'updateDirents',
    [
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
  ])
})
