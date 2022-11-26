import { jest } from '@jest/globals'
import * as QuickPickReturnValue from '../src/parts/QuickPickReturnValue/QuickPickReturnValue.js'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    closeWidget: jest.fn(() => {}),
  }
})

const ViewletQuickPick = await import(
  '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
)
const ViewletManager = await import(
  '../src/parts/ViewletManager/ViewletManager.js'
)

const render = (oldState, newState) => {
  return ViewletManager.render(
    ViewletQuickPick,
    oldState,
    newState,
    ViewletModuleId.QuickPick
  )
}

test('create', () => {
  expect(ViewletQuickPick.create()).toBeDefined()
})

test('handleBeforeInput - insertText - at end', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'ab',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(state, 'insertText', 'c', 2, 2)
  ).toMatchObject({
    value: 'abc',
    cursorOffset: 3,
  })
})

test('handleBeforeInput - insertText - at start', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'bc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(state, 'insertText', 'a', 0, 0)
  ).toMatchObject({
    value: 'abc',
    cursorOffset: 1,
  })
})

test('handleBeforeInput - deleteContentForward - at start', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(
      state,
      'deleteContentForward',
      null,
      0,
      0
    )
  ).toMatchObject({
    value: 'bc',
    cursorOffset: 0,
  })
})

test('handleBeforeInput - deleteContentForward - in middle', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(
      state,
      'deleteContentForward',
      null,
      1,
      1
    )
  ).toMatchObject({
    value: 'ac',
    cursorOffset: 1,
  })
})

test('handleBeforeInput - deleteContentBackward - at end', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(
      state,
      'deleteContentBackward',
      null,
      3,
      3
    )
  ).toMatchObject({
    value: 'ab',
    cursorOffset: 2,
  })
})

test('handleBeforeInput - deleteWordBackward', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(
      state,
      'deleteWordBackward',
      null,
      3,
      3
    )
  ).toMatchObject({
    value: '',
    cursorOffset: 0,
  })
})

test('handleBeforeInput - deleteWordForward', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'abc',
    focusedIndex: 0,
    provider: {
      getPicks() {
        return []
      },
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [],
  }
  expect(
    await ViewletQuickPick.handleBeforeInput(
      state,
      'deleteWordForward',
      null,
      0,
      0
    )
  ).toMatchObject({
    value: '',
    cursorOffset: 0,
  })
})

test.skip('handleWheel - up', () => {
  const state = {
    ...ViewletQuickPick.create(),
    itemHeight: 22,
    minLineY: 0,
    maxLineY: 2,
    height: 22,
    deltaY: 22,
    items: [
      {
        label: 'index.css',
      },
      {
        label: 'index.html',
      },
    ],
    headerHeight: 0,
  }
  expect(ViewletQuickPick.handleWheel(state, -22)).toMatchObject({
    minLineY: 0,
    maxLineY: 1,
  })
})

test('handleClickAt - first item', async () => {
  const provider = {
    selectPick: jest.fn(() => {
      return {
        command: QuickPickReturnValue.Hide,
      }
    }),
    getPicks() {
      return []
    },
    getFilterValue(value) {
      return value
    },
  }
  const state = {
    ...ViewletQuickPick.create(),
    itemHeight: 22,
    minLineY: 0,
    maxLineY: 2,
    height: 22,
    deltaY: 22,
    items: [
      {
        label: 'index.css',
      },
      {
        label: 'index.html',
      },
    ],
    provider,
    top: 0,
    headerHeight: 0,
  }
  await ViewletQuickPick.handleClickAt(state, 0, 13)
  expect(provider.selectPick).toHaveBeenCalledTimes(1)
  expect(provider.selectPick).toHaveBeenCalledWith(
    {
      label: 'index.css',
    },
    0,
    0
  )
})

test('render - set correct height', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
    itemHeight: 22,
    height: 22,
    deltaY: 22,
    items: [],
    minLineY: 0,
    maxLineY: 10,
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'index.css',
      },
    ],
  }
  expect(render(oldState, newState)).toEqual([
    [
      'Viewlet.send',
      'QuickPick',
      'setVisiblePicks',
      [
        {
          icon: undefined,
          label: 'index.css',
          posInSet: 1,
          setSize: 1,
        },
      ],
    ],
    ['Viewlet.send', 'QuickPick', 'setCursorOffset', 0],
    ['Viewlet.send', 'QuickPick', 'setItemsHeight', 22],
  ])
})
