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

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.js', () => {
  return {
    measureTextWidth() {
      return 20
    },
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
const ViewletMainCloseEditor = await import('../src/parts/ViewletMain/ViewletMainCloseEditor.js')

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
  state.activeIndex = 0
  await ViewletMainCloseEditor.closeEditor(state, 0)
  expect(state.editors).toEqual([])
  expect(state.activeIndex).toBe(-1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(2162)
})

test.skip('closeEditor - 0 0 - first tab is focused and first tab is selected', async () => {
  const state = {
    ...ViewletMain.create(1),
    activeGroupIndex: 0,
    groups: [
      {
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
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseEditor.closeEditor(state, 0)
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
  // TODO make this test setup more functional
  const state = {
    ...ViewletMain.create(1),
    activeGroupIndex: 0,
    groups: [
      {
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
      },
    ],
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
  const { newState } = await ViewletMainCloseEditor.closeEditor(state, 0)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
})

test.skip('closeEditor - 0 2 - first tab is focused and last tab is selected', async () => {
  const state = {
    ...ViewletMain.create(1),
    activeIndex: 0,
    groups: [
      {
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
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseEditor.closeEditor(state, 0)
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
  const state = {
    ...ViewletMain.create(1),
    activeGroupIndex: 0,
    groups: [
      {
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
      },
    ],
  }
  const { newState } = await ViewletMainCloseEditor.closeEditor(state, 1)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(newGroup.activeIndex).toBe(0)
  expect(newGroup.focusedIndex).toBe(0)
})

test.skip('closeEditor - 1 1 - middle tab is focused and middle tab is selected', async () => {
  const state = {
    ...ViewletMain.create(1),
    activeGroupIndex: 0,
    groups: [
      {
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
      },
    ],
  }
  await ViewletMainCloseEditor.closeEditor(state, 1)
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
  const state = {
    ...ViewletMain.create(1),
    activeGroupIndex: 0,
    groups: [
      {
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
      },
    ],
  }
  const { newState } = await ViewletMainCloseEditor.closeEditor(state, 1)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(newGroup.activeIndex).toBe(1)
  expect(newGroup.focusedIndex).toBe(1)
})

test('closeEditor - 2 0 - last tab is focused and first tab is selected', async () => {
  const state = {
    ...ViewletMain.create(1),
    activeGroupIndex: 0,
    groups: [
      {
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
      },
    ],
  }
  const { newState } = await ViewletMainCloseEditor.closeEditor(state, 2)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(newGroup.activeIndex).toBe(0)
  expect(newGroup.focusedIndex).toBe(0)
})

test('closeEditor - 2 1 - last tab is focused and middle tab is selected', async () => {
  const state = {
    ...ViewletMain.create(1),
    activeGroupIndex: 0,
    groups: [
      {
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
      },
    ],
  }
  const { newState } = await ViewletMainCloseEditor.closeEditor(state, 2)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(newGroup.activeIndex).toBe(1)
  expect(newGroup.focusedIndex).toBe(1)
})

test.skip('closeEditor - 2 2 - last tab is focused and last tab is selected', async () => {
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
  await ViewletMainCloseEditor.closeEditor(state, 2)
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
  state.activeIndex = 1
  await ViewletMainCloseEditor.closeEditor(state, 1)
  expect(state.editors).toEqual([{ uri: '/tmp/file-1.txt' }])
  expect(state.activeIndex).toBe(0)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(1, ['Viewlet.send', 'EditorText', 'renderText', [], 15, 20, 0.5])
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 2164, 1, 0)
})
