import * as VirtualList from '../src/parts/VirtualList/VirtualList.js'
import * as VirtualListHandleTouchMove from '../src/parts/VirtualList/VirtualListHandleTouchMove.js'

test('handleTouchMove - empty touches array', () => {
  const state = VirtualList.create({
    itemHeight: 62,
    headerHeight: 0,
    minimumSliderSize: 1,
  })
  expect(VirtualListHandleTouchMove.handleTouchMove(state, 0, [])).toBe(state)
})

test('handleTouchMove - scroll up', () => {
  const state = {
    ...VirtualList.create({
      itemHeight: 62,
      headerHeight: 0,
      minimumSliderSize: 1,
    }),
    height: 62,
    items: [1, 2, 3],
    deltaY: 10,
    finalDeltaY: 62 * 2 - 62,
    touchOffsetY: 0,
  }
  const newState = VirtualListHandleTouchMove.handleTouchMove(state, 0, [
    { clientX: 10, clientY: -10, identifier: 0 },
  ])
  expect(newState.touchOffsetY).toBe(-10)
  expect(newState.deltaY).toBe(20)
})
