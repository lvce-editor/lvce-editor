import { beforeEach, expect, jest, test } from '@jest/globals'
import { MainState } from '../src/parts/ViewletMain/ViewletMainTypes.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Id/Id.js', () => {
  return {
    create() {
      return 1
    },
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    disposeFunctional() {
      return []
    },
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

const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
const ViewletMain = await import('../src/parts/ViewletMain/ViewletMain.js')
const ViewletMainCloseOthers = await import('../src/parts/ViewletMain/ViewletMainCloseOthers.ts')

test('closeOthers - 0 0 - first tab is selected and first tab is focused', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 0,
        focusedIndex: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 1,
      uri: '/test/file-1.txt',
    },
  ])
})

test('closeOthers - 0 1 - first tab is focused and second tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 1,
        focusedIndex: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 1,
      uri: '/test/file-1.txt',
    },
  ])
})

test('closeOthers - 0 2 - first tab is focused and third tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 2,
        focusedIndex: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 1,
      uri: '/test/file-1.txt',
    },
  ])
})

test('closeOthers - 1 0 - second tab is focused and first tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 0,
        focusedIndex: 1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 2,
      uri: '/test/file-2.txt',
    },
  ])
})

test('closeOthers - 1 1 - second tab is focused and second tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 1,
        focusedIndex: 1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 2,
      uri: '/test/file-2.txt',
    },
  ])
})

test('closeOthers - 1 2 - second tab is focused and third tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 2,
        focusedIndex: 1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 2,
      uri: '/test/file-2.txt',
    },
  ])
})

test('closeOthers - 2 0 - third tab is focused and first tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 0,
        focusedIndex: 2,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 3,
      uri: '/test/file-3.txt',
    },
  ])
})

test('closeOthers - 2 1 - third tab is focused and second tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 1,
        focusedIndex: 2,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 3,
      uri: '/test/file-3.txt',
    },
  ])
})

test.skip('closeOthers - 2 2 - third tab is focused and third tab is selected', async () => {
  const state: MainState = {
    ...ViewletMain.create(1, '', 0, 0, 100, 100),
    activeGroupIndex: 0,
    focusedIndex: 0,
    groups: [
      {
        editors: [
          {
            uid: 1,
            uri: '/test/file-1.txt',
          },
          {
            uid: 2,
            uri: '/test/file-2.txt',
          },
          {
            uid: 3,
            uri: '/test/file-3.txt',
          },
        ],
        activeIndex: 1,
        focusedIndex: 2,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        tabsUid: 0,
      },
    ],
  }
  ViewletStates.set('EditorText', {
    factory: {
      loadContent() {},
      refresh() {},
    },
    state: {},
    renderedState: {},
  })
  const { newState, commands } = await ViewletMainCloseOthers.closeOthers(state)
  const newGroup = newState.groups[0]
  expect(newGroup.editors).toEqual([
    {
      uid: 3,
      uri: '/test/file-3.txt',
    },
  ])
  expect(commands).toEqual([
    ['Viewlet.create', 'Editor', 1],
    ['Viewlet.setBounds', 1, 0, 35, 100, 65],
    ['Viewlet.append', 1, 1],
  ])
})

test.skip('resize', () => {
  const state = ViewletMain.create(1)
  // @ts-ignore
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
