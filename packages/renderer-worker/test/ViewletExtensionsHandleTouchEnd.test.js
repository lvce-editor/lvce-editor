import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsHandleTouchEnd from '../src/parts/ViewletExtensions/ViewletExtensionsHandleTouchEnd.js'

test('handleTouchEnd', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsHandleTouchEnd.handleTouchEnd(state)).toBe(state)
})
