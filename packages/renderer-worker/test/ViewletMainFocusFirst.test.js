import * as ViewletMain from '../src/parts/ViewletMain/ViewletMain.js'
import * as ViewletMainFocusFirst from '../src/parts/ViewletMain/ViewletMainFocusFirst.js'

test('focusFirst', () => {
  const state = {
    ...ViewletMain.create(),
    editors: [{ uri: '/test/file-1.txt' }, { uri: '/test/file-2.txt' }],
  }
  const newState = ViewletMainFocusFirst.focusFirst(state)
  expect(newState.activeIndex).toBe(0)
})

test('focusFirst - no items', () => {
  const state = {
    ...ViewletMain.create(),
    editors: [],
  }
  expect(ViewletMainFocusFirst.focusFirst(state)).toBe(state)
})

test('focusFirst - focus already at first', () => {
  const state = {
    ...ViewletMain.create(),
    focusedIndex: 0,

    editors: [
      {
        uri: '/test/file-1.txt',
      },
      {
        uri: '/test/file-2.txt',
      },
    ],
  }
  expect(ViewletMainFocusFirst.focusFirst(state)).toBe(state)
})
