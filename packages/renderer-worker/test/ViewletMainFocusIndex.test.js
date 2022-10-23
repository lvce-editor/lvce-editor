import * as ViewletMainFocusIndex from '../src/parts/ViewletMain/ViewletMainFocusIndex.js'

test('focusIndex', () => {
  const state = {
    editors: [],
    activeIndex: 0,
  }
  const newState = ViewletMainFocusIndex.focusIndex(state, 1)
  expect(newState.activeIndex).toBe(1)
})
