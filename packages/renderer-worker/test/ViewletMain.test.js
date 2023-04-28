import { jest } from '@jest/globals'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Css/Css.js', () => {
  return {
    loadCssStyleSheet: jest.fn(() => {}),
    loadCssStyleSheets: jest.fn(() => {}),
    addDynamicCss: jest.fn(() => {}),
  }
})

jest.unstable_mockModule('../src/parts/ViewletEditorText/ViewletEditorText.js', () => {
  return {
    create() {
      return {}
    },
    loadContent(state) {
      return state
    },
    hasFunctionalRender: true,
    render: [],
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const ViewletMain = await import('../src/parts/ViewletMain/ViewletMain.js')

test('create', () => {
  const state = ViewletMain.create(1)
  expect(state).toBeDefined()
})

test('loadContent - no restored editors', async () => {
  const state = ViewletMain.create(1)
  expect(await ViewletMain.loadContent(state, {})).toMatchObject({
    activeIndex: -1,
    editors: [],
    focusedIndex: -1,
  })
})

test('loadContent - one restored editor', async () => {
  const state = ViewletMain.create(1)
  expect(
    await ViewletMain.loadContent(state, {
      editors: [
        {
          uri: '/test/some-file.txt',
          uid: 1,
        },
      ],
      activeIndex: 0,
    })
  ).toMatchObject({
    activeIndex: 0,
    editors: [
      {
        uri: '/test/some-file.txt',
        uid: 1,
      },
    ],
    focusedIndex: -1,
  })
})

// TODO test is flaky
test.skip('openUri - no editors exist', async () => {
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
    ...ViewletMain.create(1),
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
  await ViewletMain.openUri(state, '/tmp/file-1.txt') // TODO Viewlet Main should not know about ViewletEditorText
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 'Viewlet.send', 1, 'openViewlet', 'file-1.txt', '/tmp/file-1.txt', -1)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(3, 'Viewlet.loadModule', 'EditorText')
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

// TODO test is flaky
test.skip('openUri - different editor exists', async () => {
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
    ...ViewletMain.create(1),
    editors: ['/test/file-1.txt'],
    activeIndex: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, 'Viewlet.send', 1, 'openViewlet', 'file-2.txt', '/tmp/file-2.txt', 0)
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
              jsonrpc: JsonRpcVersion.Two,
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
  const state = ViewletMain.create(1)
  await Promise.all([
    ViewletMain.openUri(state, '/tmp/file-1.txt'),
    ViewletMain.openUri(state, '/tmp/file-2.txt'),
    ViewletMain.openUri(state, '/tmp/file-3.txt'),
  ])
  console.log('opened all files')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(3)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.send', 'EditorText', 'renderText', [], 15, 20, 0.5)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(3, 'Viewlet.send', 1, 'openViewlet', 'EditorText', 'file-1.txt', '/tmp/file-1.txt')
})

test.skip('openUri - editor with same uri exists', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, ['Viewlet.send', 'EditorText', 'renderText', [], 15, 20, 0.5])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2160, 'file-2.txt', '/tmp/file-2.txt', 0)
})

// TODO should handle error gracefully
test.skip('openUri - error reading file', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
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
  const state = ViewletMain.create(1)
  await expect(ViewletMain.openUri(state, '/tmp/file-1.txt')).rejects.toThrowError(new Error('TypeError: x is not a function'))
})

test.skip('openUri - should reuse same viewlet if it exists', async () => {
  const state = ViewletMain.create(1)
  await ViewletMain.openUri(state, '/tmp/some-file.txt')
})

test.skip('event - handleTabClick on active tab', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, ['Viewlet.send', 'EditorText', 'renderText', [], 15, 20, 0.5])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2161, 1, 0)
})

test.skip('event - handleTabClick on another tab', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletMain.handleTabClick(state, 0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, ['Viewlet.send', 'EditorText', 'renderText', [], 15, 20, 0.5])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2161, 1, 0)
})

test.skip('focusFirst', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
    ...ViewletMain.create(1),
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
    ...ViewletMain.create(1),

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
    renderedState: {},
  })
  const { newState } = await ViewletMain.closeEditor(state, 0)
  expect(newState.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
})

test.skip('closeEditor - 0 2 - first tab is focused and last tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(1),
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
    ...ViewletMain.create(1),
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
  const { newState } = await ViewletMain.closeEditor(state, 1)
  expect(newState.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(newState.activeIndex).toBe(0)
  expect(newState.focusedIndex).toBe(0)
})

test.skip('closeEditor - 1 1 - middle tab is focused and middle tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(1),
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
    ...ViewletMain.create(1),
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
  const { newState } = await ViewletMain.closeEditor(state, 1)
  expect(newState.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(newState.activeIndex).toBe(1)
  expect(newState.focusedIndex).toBe(1)
})

test('closeEditor - 2 0 - last tab is focused and first tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(1),
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
  const { newState } = await ViewletMain.closeEditor(state, 2)
  expect(newState.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(newState.activeIndex).toBe(0)
  expect(newState.focusedIndex).toBe(0)
})

test('closeEditor - 2 1 - last tab is focused and middle tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(1),

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
  const { newState } = await ViewletMain.closeEditor(state, 2)
  expect(newState.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(newState.activeIndex).toBe(1)
  expect(newState.focusedIndex).toBe(1)
})

test.skip('closeEditor - 2 2 - last tab is focused and last tab is selected', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(1),
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  await ViewletMain.openUri(state, '/tmp/file-2.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 1
  await ViewletMain.closeEditor(state, 1)
  expect(state.editors).toEqual([{ uri: '/tmp/file-1.txt' }])
  expect(state.activeIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, ['Viewlet.send', 'EditorText', 'renderText', [], 15, 20, 0.5])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2164, 1, 0)
})

test.skip('closeFocusedTab - single editor', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 101:
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
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
          jsonrpc: JsonRpcVersion.Two,
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  const state = ViewletMain.create(1)
  await ViewletMain.openUri(state, '/tmp/file-1.txt')
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  state.activeIndex = 0
  await ViewletMain.handleTabContextMenu(state, 0, 15, 35)
  expect(state.focusedIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.load', 'ContextMenu', -97, -235, 250, 132, [
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
  ])
})

test.skip('resize', () => {
  const state = ViewletMain.create(1)
  const { newState } = ViewletMain.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 200,
  })
  expect(newState).toEqual({
    activeIndex: -1,
    children: [],
    editors: [],
    focusedIndex: -1,
    height: 200,
    x: 200,
    y: 200,
    width: 200,
  })
})

test.skip('handleDrop - one file', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  const state = {
    ...ViewletMain.create(1),
    editors: [
      {
        uri: '/test/file-1.txt',
        uid: 1,
      },
    ],
    activeIndex: 0,
    focusedIndex: 2,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    tabsId: 3,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  const fileList = [
    {
      path: '/test/dropped-file.txt',
    },
  ]
  const { commands, newState } = await ViewletMain.handleDrop(state, fileList)
  expect(newState.editors).toEqual([
    {
      uri: '/test/file-1.txt',
      uid: 1,
    },
    {
      icon: '',
      label: 'dropped-file.txt',
      title: '/test/dropped-file.txt',
      uri: expect.any(String),
      uid: 2,
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.loadModule', 'Editor')
  expect(commands).toEqual([
    ['Viewlet.create', 'Editor', 2],
    ['Viewlet.addKeyBindings', 2, expect.anything()],
    ['Viewlet.setBounds', 2, 0, 35, 100, 65],
    ['Viewlet.append', 1, 2],
    ['Viewlet.focus', 2],
  ])
  expect(newState).toMatchObject({
    dragOverlayVisible: false,
  })
})
