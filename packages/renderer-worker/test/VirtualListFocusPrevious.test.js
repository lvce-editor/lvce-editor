import * as VirtualListFocusPrevious from '../src/parts/VirtualList/VirtualListFocusPrevious.js'

test('focusPrevious', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 1,
    headerHeight: 0,
    itemHeight: 62,
  }
  expect(VirtualListFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 0,
    headerHeight: 0,
    itemHeight: 62,
  }
  expect(VirtualListFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - no items', () => {
  const state = {
    items: [],
    focusedIndex: -1,
    headerHeight: 0,
    itemHeight: 62,
  }
  expect(VirtualListFocusPrevious.focusPrevious(state)).toBe(state)
})
