import * as VirtualList from '../src/parts/VirtualList/VirtualList.js'
import * as VirtualListHandleTouchStart from '../src/parts/VirtualList/VirtualListHandleTouchStart.js'

test('handleTouchStart - empty changed touches array', () => {
  const state = VirtualList.create({
    itemHeight: 62,
  })
  expect(VirtualListHandleTouchStart.handleTouchStart(state, 0, [])).toBe(state)
})
