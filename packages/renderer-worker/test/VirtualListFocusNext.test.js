import * as VirtualListFocusNext from '../src/parts/VirtualList/VirtualListFocusNext.js'

test('focusNext', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 1,
  }
  expect(VirtualListFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusNext - at end', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 2,
  }
  expect(VirtualListFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusNext - no items', () => {
  const state = {
    items: [],
    focusedIndex: -1,
  }
  expect(VirtualListFocusNext.focusNext(state)).toBe(state)
})
