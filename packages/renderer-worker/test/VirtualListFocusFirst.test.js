import * as VirtualListFocusFirst from '../src/parts/VirtualList/VirtualListFocusFirst.js'

test('focusFirst', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 2,
  }
  expect(VirtualListFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})
test('focusFirst - no items', () => {
  const state = {
    items: [],
    focusedIndex: -1,
  }
  expect(VirtualListFocusFirst.focusFirst(state)).toBe(state)
})
