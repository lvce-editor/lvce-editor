import * as VirtualListFocusLast from '../src/parts/VirtualList/VirtualListFocusLast.js'

test('focusLast', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 0,
  }
  expect(VirtualListFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusLast - no items', () => {
  const state = {
    items: [],
    focusedIndex: -1,
  }
  expect(VirtualListFocusLast.focusLast(state)).toBe(state)
})
