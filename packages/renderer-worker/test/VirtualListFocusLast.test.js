import * as VirtualListFocusLast from '../src/parts/VirtualList/VirtualListFocusLast.js'

test('focusLast', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 0,
    itemHeight: 62,
  }
  expect(VirtualListFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test.skip('focusLast - no items', () => {
  const state = {
    items: [],
    focusedIndex: -1,
    itemHeight: 62,
  }
  expect(VirtualListFocusLast.focusLast(state)).toBe(state)
})
