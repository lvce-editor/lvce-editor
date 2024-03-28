import * as VirtualList from '../src/parts/VirtualList/VirtualList.js'
import * as VirtualListHandleTouchEnd from '../src/parts/VirtualList/VirtualListHandleTouchEnd.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('handleTouchEnd - empty touches array', () => {
  const state = VirtualList.create({
    itemHeight: 62,
    headerHeight: 0,
    minimumSliderSize: 1,
  })
  expect(VirtualListHandleTouchEnd.handleTouchEnd(state, [])).toBe(state)
})
