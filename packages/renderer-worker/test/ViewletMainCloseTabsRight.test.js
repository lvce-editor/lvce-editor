import { jest } from '@jest/globals'

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
const ViewletMainCloseTabsRight = await import('../src/parts/ViewletMain/ViewletMainCloseTabsRight.js')

test('closeTabsRight - 0 0 - first tab is focused and first tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 0)
})

test('closeTabsRight - 0 1 - first tab is focused and second tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 0)
})

test('closeTabsRight - 0 2 - first tab is focused and third tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 0)
})

test('closeTabsRight - 1 0 - second tab is focused and first tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 1)
})

test('closeTabsRight - 1 1 - second tab is focused and second tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 1)
})

test('closeTabsRight - 1 2 - second tab is focused and third tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
  expect(state.editors).toEqual([
    {
      uri: '/test/file-1.txt',
    },
    {
      uri: '/test/file-2.txt',
    },
  ])
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 1)
})

test('closeTabsRight - 2 0 - third tab is focused and first tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 2)
})

test('closeTabsRight - 2 1 - third tab is focused and second tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 2)
})

test('closeTabsRight - 2 2 - third tab is focused and third tab is selected', async () => {
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
  await ViewletMainCloseTabsRight.closeTabsRight(state)
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
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'closeTabsRight', 2)
})
