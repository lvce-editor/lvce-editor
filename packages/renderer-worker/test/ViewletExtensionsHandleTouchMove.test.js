import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsHandleTouchMove from '../src/parts/ViewletExtensions/ViewletExtensionsHandleTouchMove.js'

test('handleTouchMove - empty touches array', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsHandleTouchMove.handleTouchMove(state, 0, [])).toBe(
    state
  )
})

test('handleTouchMove - scroll up', () => {
  const state = {
    ...ViewletExtensions.create(),
    itemHeight: 62,
    height: 62,
    filteredExtensions: [1, 2, 3],
    deltaY: 10,
    finalDeltaY: 62 * 2 - 62,
  }
  const newState = ViewletExtensionsHandleTouchMove.handleTouchMove(state, 0, [
    { clientX: 10, clientY: -10, identifier: 0 },
  ])
  expect(newState.touchOffsetY).toBe(-10)
  expect(newState.deltaY).toBe(20)
})
