import * as ViewletQuickPick from '../src/parts/ViewletQuickPick/ViewletQuickPick.js'
import { jest } from '@jest/globals'
import * as ViewletManager from '../src/parts/ViewletManager/ViewletManager.js'

const render = (oldState, newState) => {
  return ViewletManager.render(ViewletQuickPick, oldState, newState)
}

test('name', () => {
  expect(ViewletQuickPick.name).toBe('QuickPick')
})

test('create', () => {
  expect(ViewletQuickPick.create()).toBeDefined()
})

test('focusIndex - equal', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 1,
    provider: {},
  }
  expect(await ViewletQuickPick.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusIndex - scroll down', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    maxVisibleItems: 1,
    minLineY: 0,
    maxLineY: 1,
    items: [
      {
        label: '1',
      },
      {
        label: '2',
      },
    ],
  }
  expect(await ViewletQuickPick.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
  })
})

test('focusFirst', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 3,
    provider: {},
  }
  expect(await ViewletQuickPick.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusLast', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    items: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 2,
    provider: {},
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.focusPrevious(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    focusedIndex: 0,
    provider: {},
    items: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('handleInput - same value', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'test',
    focusedIndex: 0,
    provider: {
      getPicks: jest.fn(() => []),
      getFilterValue(value) {
        return value
      },
    },
    filteredPicks: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.handleInput(state, 'test')).toBe(state)
  expect(state.provider.getPicks).not.toHaveBeenCalled()
})

test('handleInput - different value', async () => {
  const state = {
    ...ViewletQuickPick.create(),
    value: 'test',
    focusedIndex: 0,
    provider: {
      getPicks: jest.fn(() => []),
      getFilterValue(value) {
        return value
      },
    },
    items: [{ label: '1' }, { label: '2' }, { label: '3' }],
  }
  expect(await ViewletQuickPick.handleInput(state, 'abc')).toMatchObject({
    items: [],
  })
  expect(state.provider.getPicks).toHaveBeenCalledTimes(1)
  expect(state.provider.getPicks).toHaveBeenCalledWith('abc')
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

test('handleWheel - up', () => {
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
  }
  expect(ViewletQuickPick.handleWheel(state, -22)).toMatchObject({
    minLineY: 0,
    maxLineY: 1,
  })
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
