import * as VirtualListFocusIndex from '../src/parts/VirtualList/VirtualListFocusIndex.js'

test('focusIndex', () => {
  const state = {
    items: [1, 2, 3],
    focusedIndex: 0,
  }
  expect(VirtualListFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
  })
})
