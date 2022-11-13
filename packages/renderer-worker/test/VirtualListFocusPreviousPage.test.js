import * as VirtualListFocusPreviousPage from '../src/parts/VirtualList/VirtualListFocusPreviousPage.js'

test('focusPreviousPage - already at start', () => {
  const state = {
    items: [1, 2],
    focusedIndex: 0,
  }
  expect(VirtualListFocusPreviousPage.focusPreviousPage(state)).toBe(state)
})

test('focusPreviousPage - scroll up one full page', () => {
  const state = {
    items: [1, 2, 3, 4, 5, 6],
    focusedIndex: 3,
    minLineY: 3,
    maxLineY: 6,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(VirtualListFocusPreviousPage.focusPreviousPage(state)).toMatchObject({
    minLineY: 1,
    maxLineY: 4,
    focusedIndex: 1,
  })
})

test('focusPreviousPage - scroll up half a page', () => {
  const state = {
    items: [1, 2, 3, 4, 5, 6],
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 4,
    itemHeight: 62,
    height: 62 * 3,
  }
  expect(VirtualListFocusPreviousPage.focusPreviousPage(state)).toMatchObject({
    minLineY: 0,
    maxLineY: 3,
    focusedIndex: 0,
  })
})
