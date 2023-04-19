import { jest } from '@jest/globals'
import * as Id from '../src/parts/Id/Id.js'

beforeEach(() => {
  jest.resetAllMocks()
  Id.state.id = 2
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
const ViewletMainCloseTabsLeft = await import('../src/parts/ViewletMain/ViewletMainCloseTabsLeft.js')

test('closeTabsLeft - 0 0 - first tab is focused and first tab is selected', async () => {
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
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 0)
})

test('closeTabsLeft - 0 1 - first tab is focused and second tab is selected', async () => {
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
    focusedIndex: 0,
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 0)
})

test('closeTabsLeft - 0 2 - first tab is focused and third tab is selected', async () => {
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
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 0)
})

test('closeTabsLeft - 1 0 - second tab is focused and first tab is selected', async () => {
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
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 1)
})

test('closeTabsLeft - 1 1 - second tab is focused and second tab is selected', async () => {
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
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 1)
})

test('closeTabsLeft - 1 2 - second tab is focused and third tab is selected', async () => {
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
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-2.txt',
    },
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 1)
})

test('closeTabsLeft - 2 0 - third tab is focused and first tab is selected', async () => {
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
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 2)
})

test('closeTabsLeft - 2 1 - third tab is focused and second tab is selected', async () => {
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
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 2)
})

test('closeTabsLeft - 2 2 - third tab is focused and third tab is selected', async () => {
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
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
  })
  await ViewletMainCloseTabsLeft.closeTabsLeft(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-3.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsLeft', 2)
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
