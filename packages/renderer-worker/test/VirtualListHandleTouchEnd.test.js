import * as VirtualList from '../src/parts/VirtualList/VirtualList.js'
import * as VirtualListHandleTouchEnd from '../src/parts/VirtualList/VirtualListHandleTouchEnd.js'

test('handleTouchEnd - empty touches array', () => {
  const state = VirtualList.create({
    itemHeight: 62,
    headerHeight: 0,
    minimumSliderSize: 1,
  })
  expect(VirtualListHandleTouchEnd.handleTouchEnd(state, [])).toBe(state)
})
