import * as VirtualList from '../src/parts/VirtualList/VirtualList.js'
import * as VirtualListHandleWheel from '../src/parts/VirtualList/VirtualListHandleWheel.js'

test('handleWheel - scroll down', () => {
  const state = {
    ...VirtualList.create({
      itemHeight: 62,
    }),
    items: [1, 2, 3],
    height: 124,
    deltaY: 0,
    finalDeltaY: 3 * 62 - 124,
  }
  expect(VirtualListHandleWheel.handleWheel(state, 62)).toMatchObject({
    minLineY: 1,
    deltaY: 62,
  })
})

test('handleWheel - scroll up', () => {
  const state = {
    ...VirtualList.create({ itemHeight: 62 }),
    items: [1, 2, 3],
    height: 124,
    deltaY: 62,
  }
  expect(VirtualListHandleWheel.handleWheel(state, -62)).toMatchObject({
    deltaY: 0,
    minLineY: 0,
  })
})
