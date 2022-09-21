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

test.skip('render - set correct height', () => {
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
    ['Viewlet.send', 'QuickPick', 'setCursorOffset', 0],
    ['Viewlet.send', 'QuickPick', 'setItemsHeight', 22],
  ])
})

test.skip('accessibility - aria-activedescendant should point to quick pick item', () => {
  const oldState = {
    ...ViewletQuickPick.create(),
  }
  const newState = {
    ...oldState,
    items: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
    ],
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 10,
  }
  const patches = render(oldState, newState)
  expect(patches).toEqual([])

  // expect(state.$QuickPickInput.getAttribute('aria-activedescendant')).toBe(
  //   'QuickPickItemActive'
  // )
  // expect(state.$QuickPickItems.children[0].id).toBe('QuickPickItem-1')
})
