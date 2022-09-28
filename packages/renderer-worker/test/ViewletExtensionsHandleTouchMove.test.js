import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsHandleTouchMove from '../src/parts/ViewletExtensions/ViewletExtensionsHandleTouchMove.js'

test('handleTouchMove', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsHandleTouchMove.handleTouchMove(state)).toBe(state)
})
