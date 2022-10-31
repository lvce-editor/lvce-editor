import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
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

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const ViewletStates = await import(
  '../src/parts/ViewletStates/ViewletStates.js'
)

const ViewletMain = await import('../src/parts/ViewletMain/ViewletMain.js')

test('name', () => {
  expect(ViewletMain.name).toBe('Main')
})

test('create', () => {
  const state = ViewletMain.create()
  expect(state).toBeDefined()
})

test('loadContent - no restored editors', async () => {
  const state = ViewletMain.create()
  expect(await ViewletMain.loadContent(state, {})).toEqual({
    activeIndex: -1,
    editors: [],
    focusedIndex: -1,
  })
})

test('loadContent - one restored editor', async () => {
  const state = ViewletMain.create()
  expect(
    await ViewletMain.loadContent(state, {
      editors: [
        {
          uri: '/test/some-file.txt',
        },
      ],
    })
  ).toEqual({
    activeIndex: 0,
    editors: [
      {
        uri: '/test/some-file.txt',
      },
    ],
    focusedIndex: -1,
  })
})

test('openUri - no editors exist', async () => {
  // TODO mock fileSystem instead
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readFile':
        return 'sample text'
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }
  await ViewletMain.openUri(state, '/tmp/file-1.txt') // TODO Viewlet Main should not know about ViewletEditorText
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    1,
    'Viewlet.send',
    'Main',
    'openViewlet',
    'file-1.txt',
    '/tmp/file-1.txt',
    -1
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    3,
    'Viewlet.load',
    'EditorText'
  )
  // expect(RendererProcess.invoke).toHaveBeenNthCalledWith(3, [
  //   'Viewlet.send',
  //   'EditorText',
  //   'renderText',
  //   undefined,
  //   NaN,
  //   [],
  //   15,
  //   20,
  //   0.5,
  // )
})

test('openUri - different editor exists', async () => {
  // TODO mock file system instead
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'FileSystem.readFile':
        return 'sample text'
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: ['/test/file-1.txt'],
    activeIndex: 0,
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    1,
    'Viewlet.send',
    'Main',
    'openViewlet',
    'file-2.txt',
    '/tmp/file-2.txt',
    0
  )
  expect(state.activeIndex).toBe(1)
})

test.skip('openUri - race condition', async () => {
  const pending = []
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        pending.unshift(message)
        if (message.params[0] === '/tmp/file-3.txt') {
          console.log('resolve all')
          for (const pendingMessage of pending) {
            SharedProcess.state.receive({
              id: message.id,
              jsonrpc: '2.0',
              result: `sample text for ${pendingMessage.params[0]}`,
            })
          }
        }
        break
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletMain.create()
  await Promise.all([
    ViewletMain.openUri(state, '/tmp/file-1.txt'),
    ViewletMain.openUri(state, '/tmp/file-2.txt'),
    ViewletMain.openUri(state, '/tmp/file-3.txt'),
  ])
  console.log('opened all files')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    'Viewlet.send',
    'EditorText',
    'renderText',
    [],
    15,
    20,
    0.5
  )
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    3,
    'Viewlet.send',
    'Main',
    'openViewlet',
    'EditorText',
    'file-1.txt',
    '/tmp/file-1.txt'
  )
})

test.skip('openUri - editor with same uri exists', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test.skip('openUri - editor with different uri exists', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    'Viewlet.send',
    'EditorText',
    'renderText',
    [],
    15,
    20,
    0.5,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(
    2,
    2160,
    'file-2.txt',
    '/tmp/file-2.txt',
    0
  )
})

// TODO should handle error gracefully
test.skip('openUri - error reading file', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
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
  RendererProcess.invoke.mockImplementation(() => {})
  const state = ViewletMain.create()
  await expect(
    ViewletMain.openUri(state, '/tmp/file-1.txt')
  ).rejects.toThrowError(new Error('TypeError: x is not a function'))
})

test.skip('openUri - should reuse same viewlet if it exists', async () => {
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/some-file.txt')
})

test.skip('event - handleTabClick on active tab', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.handleTabClick(0)
  expect(RendererProcess.invoke).not.toHaveBeenCalled()
})

test.skip('openUri, then opening a different uri, then open the first uri again', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    'Viewlet.send',
    'EditorText',
    'renderText',
    [],
    15,
    20,
    0.5,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2161, 1, 0)
})

test.skip('event - handleTabClick on another tab', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.handleTabClick(state, 0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    'Viewlet.send',
    'EditorText',
    'renderText',
    [],
    15,
    20,
    0.5,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2161, 1, 0)
})

test.skip('focusFirst', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 1
  await ViewletMain.focusFirst(state)
  expect(state.activeIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2161, 1, 0)
})

test.skip('focusLast', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  await ViewletMain.openUri(state, '/tmp/file-3.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 0
  await ViewletMain.focusLast(state)
  expect(state.activeIndex).toBe(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2161, 0, 2)
})

test.skip('focusNext - in middle', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  await ViewletMain.openUri(state, '/tmp/file-3.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 1
  await ViewletMain.focusNext(state)
  expect(state.activeIndex).toBe(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2161, 1, 2)
})

test.skip('focusNext - at end', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  await ViewletMain.openUri(state, '/tmp/file-3.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 2
  await ViewletMain.focusNext(state)
  expect(state.activeIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2161, 2, 0)
})

test.skip('focusPrevious - in middle', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  await ViewletMain.openUri(state, '/tmp/file-3.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 1
  await ViewletMain.focusPrevious(state)
  expect(state.activeIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2161, 1, 0)
})

test.skip('focusPrevious - at start', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  await ViewletMain.openUri(state, '/tmp/file-3.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 0
  await ViewletMain.focusPrevious(state)
  expect(state.activeIndex).toBe(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2161, 0, 2)
})

test.skip('closeAllEditors', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 0
  ViewletMain.closeAllEditors(state)
  expect(state.editors).toEqual([])
  expect(state.activeIndex).toBe(-1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2162)
})

test.skip('closeEditor - single editor', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 0
  await ViewletMain.closeEditor(state, 0)
  expect(state.editors).toEqual([])
  expect(state.activeIndex).toBe(-1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2162)
})

test.skip('closeEditor - 0 0 - first tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeEditor(state, 0)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2164, 0, 0)
})

test('closeEditor - 0 1 - first is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // TODO make this test setup more functional
  const state = {
    ...ViewletMain.create(),

    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 0,
  }
  // TODO main has strong dependency on viewlet, that makes testing difficult
  // and is probably a sign for bad code structure
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeEditor(state, 0)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOneTabOnly',
    0
  )
})

test.skip('closeEditor - 0 2 - first tab is focused and last tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeEditor(state, 0)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(state.activeIndex).toBe(1)
  expect(state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2162)
})

test('closeEditor - 1 0 - middle tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 1,
  }
  await ViewletMain.closeEditor(state, 1)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(state.activeIndex).toBe(0)
  expect(state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOneTabOnly',
    1
  )
})

test.skip('closeEditor - 1 1 - middle tab is focused and middle tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 1,
  }
  await ViewletMain.closeEditor(state, 1)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(state.activeIndex).toBe(0)
  expect(state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2161, 0, 2)
})

test('closeEditor - 1 2 - middle tab is focused and last tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 1,
  }
  await ViewletMain.closeEditor(state, 1)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(state.activeIndex).toBe(1)
  expect(state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOneTabOnly',
    1
  )
})

test('closeEditor - 2 0 - last tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 2,
  }
  await ViewletMain.closeEditor(state, 2)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(state.activeIndex).toBe(0)
  expect(state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOneTabOnly',
    2
  )
})

test('closeEditor - 2 1 - last tab is focused and middle tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),

    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 2,
  }
  await ViewletMain.closeEditor(state, 2)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(state.activeIndex).toBe(1)
  expect(state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOneTabOnly',
    2
  )
})

test.skip('closeEditor - 2 2 - last tab is focused and last tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 2,
  }
  await ViewletMain.closeEditor(state, 2)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(state.activeIndex).toBe(1)
  expect(state.focusedIndex).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2164, 2, 1)
})

test.skip('closeEditor - should then show editor to the left', async () => {
  SharedProcess.state.send = jest.fn(async (message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 1
  await ViewletMain.closeEditor(state, 1)
  expect(state.editors).toEqual([{ uri: '/tmp/file-1.txt' }])
  expect(state.activeIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, [
    'Viewlet.send',
    'EditorText',
    'renderText',
    [],
    15,
    20,
    0.5,
  ])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2164, 1, 0)
})

test.skip('closeFocusedTab - single editor', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 0
  state.focusedIndex = 0
  ViewletMain.closeFocusedTab(state)
  expect(state.editors).toEqual([])
  expect(state.activeIndex).toBe(-1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2162)
})

test.skip('handleTabContextMenu', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create()
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 0
  await ViewletMain.handleTabContextMenu(state, 0, 15, 35)
  expect(state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.load',
    'ContextMenu',
    -97,
    -235,
    250,
    132,
    [
      {
        command: 105,
        flags: 0,
        id: 'tabClose',
        label: 'Close', // TODO only label and flags are necessary to send
      },
      {
        command: 106,
        flags: 0,
        id: 'tabCloseOthers',
        label: 'Close Others',
      },
      {
        command: 107,
        flags: 0,
        id: 'tabCloseToTheRight',
        label: 'Close to the Right',
      },
      {
        command: -1,
        flags: 0,
        id: 'tabCloseAll',
        label: 'Close All',
      },
    ]
  )
})

test('closeOthers - 0 0 - first tab is selected and first tab is focused', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    0,
    0
  )
})

test('closeOthers - 0 1 - first tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    0,
    0
  )
})

test('closeOthers - 0 2 - first tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    0,
    0
  )
})

test('closeOthers - 1 0 - second tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    1,
    1
  )
})

test('closeOthers - 1 1 - second tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    1,
    1
  )
})

test('closeOthers - 1 2 - second tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    1,
    1
  )
})

test('closeOthers - 2 0 - third tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    2,
    2
  )
})

test('closeOthers - 2 1 - third tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    2,
    2
  )
})

test('closeOthers - 2 2 - third tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeOthers(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeOthers',
    2,
    2
  )
})

test('closeTabsRight - 0 0 - first tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    0
  )
})

test('closeTabsRight - 0 1 - first tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    0
  )
})

test('closeTabsRight - 0 2 - first tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    0
  )
})

test('closeTabsRight - 1 0 - second tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    1
  )
})

test('closeTabsRight - 1 1 - second tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    1
  )
})

test('closeTabsRight - 1 2 - second tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    1
  )
})

test('closeTabsRight - 2 0 - third tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    2
  )
})

test('closeTabsRight - 2 1 - third tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    2
  )
})

test('closeTabsRight - 2 2 - third tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsRight',
    2
  )
})

test('closeTabsLeft - 0 0 - first tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    0
  )
})

test('closeTabsLeft - 0 1 - first tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    0
  )
})

test('closeTabsLeft - 0 2 - first tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    0
  )
})

test('closeTabsLeft - 1 0 - second tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    1
  )
})

test('closeTabsLeft - 1 1 - second tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    1
  )
})

test('closeTabsLeft - 1 2 - second tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 2,
    focusedIndex: 1,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    1
  )
})

test('closeTabsLeft - 2 0 - third tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 0,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    2
  )
})

test('closeTabsLeft - 2 1 - third tab is focused and second tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    2
  )
})

test('closeTabsLeft - 2 2 - third tab is focused and third tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(),
    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
      {
        uri: '/test/file-3.txt',
      },
    ],
    activeIndex: 1,
    focusedIndex: 2,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMain.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'Main',
    'closeTabsLeft',
    2
  )
})

test.skip('resize', () => {
  const state = ViewletMain.create()
  const { newState } = ViewletMain.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  expect(newState).toEqual({
    activeIndex: -1,
    children: [],
    editors: [],
    focusedIndex: -1,
    height: 200,
    left: 200,
    top: 200,
    width: 200,
  })
})
