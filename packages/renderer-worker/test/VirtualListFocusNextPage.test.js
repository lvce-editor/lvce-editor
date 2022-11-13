import * as VirtualListFocusNextPage from '../src/parts/VirtualList/VirtualListFocusNextPage.js'

test('focusNextPage - scroll down one full page', () => {
  const state = {
    items: [1, 2, 3, 4, 5, 6],
    minLineY: 0,
    maxLineY: 3,
    focusedIndex: 0,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(VirtualListFocusNextPage.focusNextPage(state)).toMatchObject({
    minLineY: 2,
    maxLineY: 5,
    focusedIndex: 4,
  })
})

test('focusNextPage - scroll down half a page', () => {
  const state = {
    items: [1, 2, 3, 4, 5, 6],
    minLineY: 3,
    maxLineY: 6,
    focusedIndex: 4,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(VirtualListFocusNextPage.focusNextPage(state)).toMatchObject({
    minLineY: 3,
    maxLineY: 6,
    focusedIndex: 5,
  })
})

test('focusNextPage - already at end', () => {
  const state = {
    items: [1, 2],
    minLineY: 1,
    maxLineY: 2,
    focusedIndex: 1,
  }
  expect(VirtualListFocusNextPage.focusNextPage(state)).toBe(state)
})
