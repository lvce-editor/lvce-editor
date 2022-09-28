import * as ViewletExtensions from '../src/parts/ViewletExtensions/ViewletExtensions.js'
import * as ViewletExtensionsHandleTouchStart from '../src/parts/ViewletExtensions/ViewletExtensionsHandleTouchStart.js'

test('handleTouchStart', () => {
  const state = ViewletExtensions.create()
  expect(ViewletExtensionsHandleTouchStart.handleTouchStart(state)).toBe(state)
})
