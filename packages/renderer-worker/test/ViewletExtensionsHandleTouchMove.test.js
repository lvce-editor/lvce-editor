import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsHandleTouchMove from '../src/parts/ViewletExtensions/ViewletExtensionsHandleTouchMove.js'
import { ITEM_HEIGHT } from '../src/parts/ViewletExtensions/ViewletExtensionsShared.js'

test('handleTouchMove - empty touches array', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsHandleTouchMove.handleTouchMove(state, [])).toBe(
    state
  )
})

test('handleTouchMove - scroll up', () => {
  const state = {
    ...ViewletExtensions.create(),
    height: ITEM_HEIGHT,
    filteredExtensions: [1, 2, 3],
    deltaY: 10,
  }
  const newState = ViewletExtensionsHandleTouchMove.handleTouchMove(state, [
    { clientX: 10, clientY: -10, identifier: 0 },
  ])
  expect(newState.touchOffsetY).toBe(-10)
  expect(newState.deltaY).toBe(20)
})
